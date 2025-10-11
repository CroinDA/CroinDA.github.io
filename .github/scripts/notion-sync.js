// Notion → GitHub Pages 완전 자동 동기화 스크립트
// 이미지 다운로드 및 업로드 포함

const { Client } = require('@notionhq/client');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// 메인 함수
async function syncNotionToBlog() {
  console.log('🔄 Notion 동기화 시작...');
  
  try {
    // "업로드 준비" 상태인 페이지 가져오기
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
    console.error('❌ 오류 발생:', error);
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
    const date = page.properties['작성일'].date?.start || new Date().toISOString().split('T')[0];
    
    console.log(`\n📝 처리 중: ${title}`);
    
    // 페이지 콘텐츠 가져오기
    const blocks = await getPageBlocks(page.id);
    
    // 이미지 처리
    const imageMap = await processImages(blocks, date, fileName);
    
    // 마크다운 변환
    const markdown = await blocksToMarkdown(blocks, imageMap);
    
    // Front Matter 생성
    const frontMatter = createFrontMatter({
      title,
      categories,
      tags,
      useMath,
      authorProfile
    });
    
    // 최종 마크다운
    const finalMarkdown = `${frontMatter}\n\n${markdown}`;
    
    // 파일 저장
    const postPath = path.join('_posts', `${date}-${fileName}.md`);
    fs.writeFileSync(postPath, finalMarkdown, 'utf8');
    console.log(`✅ 저장: ${postPath}`);
    
    // Notion 상태 업데이트
    await notion.pages.update({
      page_id: page.id,
      properties: {
        '상태': {
          select: {
            name: '업로드 완료'
          }
        },
        '업로드일': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        }
      }
    });
    console.log(`✅ Notion 상태 업데이트 완료`);
    
  } catch (error) {
    console.error(`❌ 페이지 처리 실패:`, error);
  }
}

// 페이지 블록 가져오기
async function getPageBlocks(pageId) {
  const blocks = [];
  let cursor;
  
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor
    });
    
    blocks.push(...results);
    
    if (!next_cursor) break;
    cursor = next_cursor;
  }
  
  return blocks;
}

// 이미지 처리 (다운로드 및 저장)
async function processImages(blocks, date, fileName) {
  const imageMap = new Map();
  let imageIndex = 1;
  
  // images 폴더 생성
  const imageDir = path.join('images', `${date}-${fileName}`);
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  
  for (const block of blocks) {
    if (block.type === 'image') {
      const imageUrl = block.image.file?.url || block.image.external?.url;
      
      if (imageUrl) {
        console.log(`  📸 이미지 ${imageIndex} 다운로드 중...`);
        
        try {
          // 이미지 다운로드
          const response = await fetch(imageUrl);
          const buffer = await response.buffer();
          
          // 파일명 생성
          const ext = path.extname(imageUrl.split('?')[0]) || '.png';
          const imageName = `image${imageIndex}${ext}`;
          const imagePath = path.join(imageDir, imageName);
          
          // 이미지 저장
          fs.writeFileSync(imagePath, buffer);
          
          // 경로 매핑
          const relativePath = `../../images/${date}-${fileName}/${imageName}`;
          imageMap.set(block.id, relativePath);
          
          console.log(`  ✅ 저장: ${imagePath}`);
          imageIndex++;
          
        } catch (error) {
          console.error(`  ❌ 이미지 다운로드 실패:`, error.message);
        }
      }
    }
  }
  
  return imageMap;
}

// 블록을 마크다운으로 변환
async function blocksToMarkdown(blocks, imageMap) {
  let markdown = '';
  
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        markdown += richTextToMarkdown(block.paragraph.rich_text) + '\n\n';
        break;
      
      case 'heading_1':
        markdown += '# ' + richTextToMarkdown(block.heading_1.rich_text) + '\n\n';
        break;
      
      case 'heading_2':
        markdown += '## ' + richTextToMarkdown(block.heading_2.rich_text) + '\n\n';
        break;
      
      case 'heading_3':
        markdown += '### ' + richTextToMarkdown(block.heading_3.rich_text) + '\n\n';
        break;
      
      case 'bulleted_list_item':
        markdown += '- ' + richTextToMarkdown(block.bulleted_list_item.rich_text) + '\n';
        break;
      
      case 'numbered_list_item':
        markdown += '1. ' + richTextToMarkdown(block.numbered_list_item.rich_text) + '\n';
        break;
      
      case 'code':
        const language = block.code.language || '';
        const code = richTextToMarkdown(block.code.rich_text);
        markdown += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        break;
      
      case 'image':
        const imagePath = imageMap.get(block.id);
        if (imagePath) {
          const caption = richTextToMarkdown(block.image.caption);
          markdown += `![${caption}](${imagePath})\n\n`;
        }
        break;
      
      case 'divider':
        markdown += '---\n\n';
        break;
      
      case 'quote':
        markdown += '> ' + richTextToMarkdown(block.quote.rich_text) + '\n\n';
        break;
      
      case 'equation':
        markdown += `$$\n${block.equation.expression}\n$$\n\n`;
        break;
    }
  }
  
  return markdown.trim();
}

// Rich Text를 마크다운으로 변환
function richTextToMarkdown(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  
  return richTextArray.map(text => {
    let result = text.plain_text;
    
    // 스타일 적용
    if (text.annotations.bold) result = `**${result}**`;
    if (text.annotations.italic) result = `*${result}*`;
    if (text.annotations.code) result = `\`${result}\``;
    if (text.annotations.strikethrough) result = `~~${result}~~`;
    
    // 링크 적용
    if (text.href) result = `[${result}](${text.href})`;
    
    return result;
  }).join('');
}

// Front Matter 생성
function createFrontMatter({ title, categories, tags, useMath, authorProfile }) {
  const categoriesStr = categories.map(c => `  - ${c}`).join('\n');
  const tagsStr = tags.map(t => `  - ${t}`).join('\n');
  
  return `---
layout: single
title: "${title}"
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
