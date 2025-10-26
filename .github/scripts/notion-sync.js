// Notion → GitHub Pages 완전 자동 동기화 스크립트
// 이미지 다운로드 및 업로드 포함 (axios 사용)
// 표(table), 형광펜(배경색), 줄바꿈, 중첩 블록, 인라인 수식 지원

const { Client } = require('@notionhq/client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// 메인 함수
async function syncNotionToBlog() {
  console.log('🔄 Notion 동기화 시작...');
  
  try {
    // "업로드 준비" 상태인 페이지 가져오기 (상태 기반으로만 작동)
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: '상태',
        select: {
          equals: '업로드 준비'
        }
      }
    });
    
    console.log(`📄 ${response.results.length}개의 페이지 발견`);
    
    for (const page of response.results) {
      await processPage(page);
    }
    
    console.log('✅ 동기화 완료!');
    
  } catch (error) {
    console.error('❌오류 발생:', error);
    process.exit(1);
  }
}

// 페이지 처리
async function processPage(page) {
  try {
    // 페이지 속성 추출
    const title = page.properties['제목'].title[0]?.plain_text || 'Untitled';
    const fileName = page.properties['파일명'].rich_text[0]?.plain_text || 'untitled';
    const categories = page.properties['카테고리'].multi_select.map(c => c.name);
    const tags = page.properties['태그'].multi_select.map(t => t.name);
    const useMath = page.properties['use_math'].checkbox;
    const authorProfile = page.properties['author_profile'].checkbox;
    
    // 작성일 처리 - 반드시 작성일 속성에서 가져오기
    let date;
    if (page.properties['작성일']?.date?.start) {
      date = page.properties['작성일'].date.start.split('T')[0]; // YYYY-MM-DD 형식
      console.log(`  📅 작성일 속성: ${date}`);
    } else {
      // 작성일이 없으면 오늘 날짜 사용 (경고 표시)
      date = new Date().toISOString().split('T')[0];
      console.log(`  ⚠️ 작성일 속성이 없어 오늘 날짜 사용: ${date}`);
    }
    
    console.log(`\n📝 처리 중: ${title}`);
    console.log(`  📅 사용할 날짜: ${date}`);
    
    // 페이지 콘텐츠 가져오기 (중첩 블록 포함)
    const blocks = await getPageBlocks(page.id);
    console.log(`  📦 총 ${blocks.length}개 블록 발견`);
    
    // 이미지 블록 개수 확인
    const imageBlocks = countBlocksByType(blocks, 'image');
    console.log(`  🖼️ 이미지 블록: ${imageBlocks}개`);
    
    // 표 블록 개수 확인
    const tableBlocks = countBlocksByType(blocks, 'table');
    console.log(`  📊 표 블록: ${tableBlocks}개`);
    
    // 이미지 처리
    const imageMap = await processImages(blocks, date, fileName);
    
    // 마크다운 변환
    const markdown = await blocksToMarkdown(blocks, imageMap, 0);
    
    // Front Matter 생성
    const frontMatter = createFrontMatter({
      title,
      categories,
      tags,
      useMath,
      authorProfile,
      date  // 작성일을 front matter에도 추가
    });
    
    // 최종 마크다운
    const finalMarkdown = `${frontMatter}\n\n${markdown}`;
    
    // 파일 저장 - 작성일 기준으로 파일명 생성
    const postPath = path.join('_posts', `${date}-${fileName}.md`);
    fs.writeFileSync(postPath, finalMarkdown, 'utf8');
    console.log(`✅ 저장: ${postPath}`);
    
    // 현재 시간을 "마지막 수정일"로 기록
    const currentDateTime = new Date().toISOString();
    
    // Notion 상태 업데이트
    await notion.pages.update({
      page_id: page.id,
      properties: {
        '상태': {
          select: {
            name: '업로드 완료'
          }
        },
        '마지막 수정일': {
          date: {
            start: currentDateTime
          }
        }
      }
    });
    console.log(`✅ Notion 상태 업데이트 완료 (마지막 수정일: ${currentDateTime})`);
    
  } catch (error) {
    console.error(`❌ 페이지 처리 실패:`, error);
    throw error;
  }
}

// 특정 타입의 블록 개수 세기 (재귀적)
function countBlocksByType(blocks, type) {
  let count = 0;
  for (const block of blocks) {
    if (block.type === type) count++;
    if (block.children) {
      count += countBlocksByType(block.children, type);
    }
  }
  return count;
}

// 페이지 블록 가져오기 (중첩 블록 포함)
async function getPageBlocks(blockId, depth = 0) {
  const allBlocks = [];
  let cursor;
  
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor
    });
    
    for (const block of results) {
      allBlocks.push(block);
      
      // 자식 블록이 있는 경우 재귀적으로 가져오기
      if (block.has_children) {
        const children = await getPageBlocks(block.id, depth + 1);
        block.children = children;  // 블록 객체에 children 추가
        console.log(`  🔍 중첩 블록 발견 (레벨 ${depth + 1}): ${children.length}개`);
      }
    }
    
    if (!next_cursor) break;
    cursor = next_cursor;
  }
  
  return allBlocks;
}

// 이미지 처리 (다운로드 및 저장) - axios 사용
async function processImages(blocks, date, fileName) {
  const imageMap = new Map();
  let imageIndex = 1;
  
  // images 폴더 생성
  const imageDir = path.join('images', `${date}-${fileName}`);
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  
  // 재귀적으로 모든 이미지 블록 찾기
  async function findImages(blockList) {
    for (const block of blockList) {
      if (block.type === 'image') {
        // Notion API의 이미지 URL 추출
        let imageUrl = null;
        
        if (block.image.type === 'file') {
          imageUrl = block.image.file.url;
        } else if (block.image.type === 'external') {
          imageUrl = block.image.external.url;
        }
        
        if (imageUrl) {
          console.log(`  📸 이미지 ${imageIndex} 다운로드 중... (${imageUrl.substring(0, 50)}...)`);
          
          try {
            // axios로 이미지 다운로드
            const response = await axios.get(imageUrl, {
              responseType: 'arraybuffer',
              timeout: 30000
            });
            
            // 파일명 생성
            const ext = path.extname(imageUrl.split('?')[0]) || '.png';
            const imageName = `image${imageIndex}${ext}`;
            const imagePath = path.join(imageDir, imageName);
            
            // 이미지 저장
            fs.writeFileSync(imagePath, response.data);
            
            // 경로 매핑
            const relativePath = `/images/${date}-${fileName}/${imageName}`;
            imageMap.set(block.id, relativePath);
            
            console.log(`  ✅ 저장: ${imagePath}`);
            imageIndex++;
            
          } catch (error) {
            console.error(`  ❌ 이미지 다운로드 실패:`, error.message);
          }
        } else {
          console.log(`  ⚠️ 이미지 URL을 찾을 수 없습니다`);
        }
      }
      
      // 중첩된 블록의 이미지도 처리
      if (block.children) {
        await findImages(block.children);
      }
    }
  }
  
  await findImages(blocks);
  return imageMap;
}

// 블록을 마크다운으로 변환 (중첩 블록 완전 지원)
async function blocksToMarkdown(blocks, imageMap, depth = 0) {
  let markdown = '';
  
  for (const block of blocks) {
    const indent = '    '.repeat(depth);  // 들여쓰기 4칸
    
    switch (block.type) {
      case 'paragraph':
        const paragraphText = richTextToMarkdown(block.paragraph.rich_text);
        
        // 빈 paragraph는 줄바꿈으로 처리
        if (paragraphText.trim() === '') {
          markdown += '<br>\n\n';
        } else {
          markdown += indent + paragraphText + '\n\n';
        }
        
        // paragraph 내부의 중첩 블록도 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
      
      case 'heading_1':
        markdown += '# ' + richTextToMarkdown(block.heading_1.rich_text) + '\n\n';
        
        // heading 내부의 중첩 블록도 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
      
      case 'heading_2':
        markdown += '## ' + richTextToMarkdown(block.heading_2.rich_text) + '\n\n';
        
        // heading 내부의 중첩 블록도 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
      
      case 'heading_3':
        markdown += '### ' + richTextToMarkdown(block.heading_3.rich_text) + '\n\n';
        
        // heading 내부의 중첩 블록도 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
      
      case 'bulleted_list_item':
        markdown += indent + '- ' + richTextToMarkdown(block.bulleted_list_item.rich_text) + '\n';
        
        // 중첩된 리스트 항목 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth + 1);
        }
        break;
      
      case 'numbered_list_item':
        markdown += indent + '1. ' + richTextToMarkdown(block.numbered_list_item.rich_text) + '\n';
        
        // 중첩된 리스트 항목 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth + 1);
        }
        break;
      
      case 'to_do':
        const checked = block.to_do.checked ? '[x]' : '[ ]';
        markdown += indent + `- ${checked} ` + richTextToMarkdown(block.to_do.rich_text) + '\n';
        
        // 중첩된 항목 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth + 1);
        }
        break;
      
      case 'toggle':
        markdown += indent + '- ' + richTextToMarkdown(block.toggle.rich_text) + '\n';
        
        // 토글 내부 콘텐츠 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth + 1);
        }
        break;
      
      case 'code':
        const language = block.code.language || '';
        const code = richTextToMarkdown(block.code.rich_text);
        markdown += indent + `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        break;
      
      case 'image':
        const imagePath = imageMap.get(block.id);
        if (imagePath) {
          const caption = richTextToMarkdown(block.image.caption);
          markdown += indent + `![${caption}](${imagePath})\n\n`;
        }
        break;
      
      case 'table':
        markdown += await tableToMarkdown(block);
        break;
      
      case 'divider':
        markdown += '---\n\n';
        break;
      
      case 'quote':
        markdown += '> ' + richTextToMarkdown(block.quote.rich_text) + '\n\n';
        
        // quote 내부의 중첩 블록도 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
      
      case 'callout':
        const calloutText = richTextToMarkdown(block.callout.rich_text);
        markdown += `> 💡 ${calloutText}\n\n`;
        
        // callout 내부 콘텐츠 처리
        if (block.children && block.children.length > 0) {
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
      
      case 'equation':
        markdown += `$$\n${block.equation.expression}\n$$\n\n`;
        break;
      
      default:
        // 알 수 없는 블록 타입도 children 처리
        if (block.children && block.children.length > 0) {
          console.log(`  ⚠️ 알 수 없는 블록 타입: ${block.type}, children 처리 진행`);
          markdown += await blocksToMarkdown(block.children, imageMap, depth);
        }
        break;
    }
  }
  
  return markdown;
}

// 표를 마크다운으로 변환 (들여쓰기 없이 처리)
async function tableToMarkdown(tableBlock) {
  try {
    console.log(`  📊 표 처리 중...`);
    
    // 표의 행(row) 블록들 가져오기
    const { results: rows } = await notion.blocks.children.list({
      block_id: tableBlock.id
    });
    
    if (rows.length === 0) {
      return '';
    }
    
    // 표 시작 전에 빈 줄 추가 (Jekyll/Kramdown 파싱 개선)
    let markdown = '\n\n';
    const hasHeader = tableBlock.table.has_column_header;
    
    // 각 행 처리 (들여쓰기 없음!)
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      if (row.type === 'table_row') {
        const cells = row.table_row.cells;
        
        // 셀들을 마크다운으로 변환 (줄바꿈 처리 포함)
        const cellTexts = cells.map(cell => richTextToMarkdown(cell, true));
        markdown += '| ' + cellTexts.join(' | ') + ' |\n';
        
        // 첫 번째 행이 헤더인 경우, 구분선 추가
        if (i === 0 && hasHeader) {
          const separator = cells.map(() => '---').join(' | ');
          markdown += '| ' + separator + ' |\n';
        }
      }
    }
    
    // 표 끝에 빈 줄 3개 추가 (Jekyll/Kramdown 파싱 개선)
    markdown += '\n\n\n';
    console.log(`  ✅ 표 변환 완료 (${rows.length}행)`);
    return markdown;
    
  } catch (error) {
    console.error(`  ❌ 표 변환 실패:`, error.message);
    return '';
  }
}

// Rich Text를 마크다운으로 변환 (형광펜 + 인라인 수식 + 줄바꿈 지원)
function richTextToMarkdown(richTextArray, inTableCell = false) {
  if (!richTextArray || richTextArray.length === 0) return '';
  
  return richTextArray.map(text => {
    // 인라인 수식 처리 (equation 타입) - Single dollar로 인라인 렌더링
    if (text.type === 'equation') {
      return `$${text.equation.expression}$`;
    }
    
    let result = text.plain_text;
    
    // 줄바꿈 처리 - Notion의 \n을 HTML <br><br>로 변환
    // 표 셀 안과 일반 텍스트 모두 적용
    if (result.includes('\n')) {
      result = result.replace(/\n/g, '<br><br>');
    }
    
    // 스타일 적용
    if (text.annotations.bold) result = `**${result}**`;
    if (text.annotations.italic) result = `*${result}*`;
    if (text.annotations.code) result = `\`${result}\``;
    if (text.annotations.strikethrough) result = `~~${result}~~`;
    
    // 형광펜(배경색) 지원
    const bgColor = text.annotations.color;
    if (bgColor && bgColor.includes('_background')) {
      const colorName = bgColor.replace('_background', '');
      result = `<mark style="background-color: ${getBackgroundColor(colorName)}">${result}</mark>`;
    }
    
    // 링크 적용
    if (text.href) result = `[${result}](${text.href})`;
    
    return result;
  }).join('');
}

// Notion 배경색을 CSS 색상 코드로 매핑
function getBackgroundColor(colorName) {
  const colorMap = {
    'gray': '#ebeced',
    'brown': '#e9e5e3',
    'orange': '#fadec9',
    'yellow': '#fdecc8',
    'green': '#dbeddb',
    'blue': '#d3e5ef',
    'purple': '#e8deee',
    'pink': '#f5e0e9',
    'red': '#ffe2dd',
    'default': '#fff3cd'
  };
  
  return colorMap[colorName] || colorMap['default'];
}

// Front Matter 생성
function createFrontMatter({ title, categories, tags, useMath, authorProfile, date }) {
  const categoriesStr = categories.map(c => `  - ${c}`).join('\n');
  const tagsStr = tags.map(t => `  - ${t}`).join('\n');
  
  return `---
layout: single
title: "${title}"
date: ${date}
categories:
${categoriesStr}
tags:
${tagsStr}
author_profile: ${authorProfile}
use_math: ${useMath}
---`;
}

// 실행
syncNotionToBlog();