/* ═══════════════════════════════════════════════════════
   og — OG 이미지 동적 생성 (Vercel Edge Function)
   히어로 섹션 디자인을 반영한 1200x630 PNG 이미지 생성
   ═══════════════════════════════════════════════════════ */

import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAF8',
            fontFamily: 'sans-serif',
          },
          children: [
            // 배지
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#eef2ff',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  marginBottom: '32px',
                  fontSize: '18px',
                  color: '#4f46e5',
                  fontWeight: 600,
                },
                children: '🌿 말씀을 삶으로 이어주는 시간',
              },
            },
            // 메인 제목 1줄
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '52px',
                  fontWeight: 800,
                  color: '#111827',
                  marginBottom: '12px',
                  textAlign: 'center',
                },
                children: '듣고 끝나는 설교에서,',
              },
            },
            // 메인 제목 2줄 (그래디언트)
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '52px',
                  fontWeight: 800,
                  backgroundImage: 'linear-gradient(to right, #4f46e5, #818cf8)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '32px',
                  textAlign: 'center',
                },
                children: '내 삶에 남는 말씀으로',
              },
            },
            // 부제
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '24px',
                  color: '#6b7280',
                  textAlign: 'center',
                },
                children: '설교 URL을 입력하면 핵심 요약으로 말씀의 이해와 묵상을 돕습니다.',
              },
            },
          ],
        },
      }
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
