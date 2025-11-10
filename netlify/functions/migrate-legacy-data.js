// netlify/functions/migrate-legacy-data.js
import { neon } from '@netlify/neon';

// 기존 데이터를 함수 외부에서 import하거나 여기에 정의
const legacyData = {
    tiers: [
        { id: "황", color: "#AA8B30" },
        { id: "S", color: "#9F7AEA" },
        { id: "A", color: "#F87171" },
        { id: "B", color: "#FB923C" },
        { id: "C", color: "#FACC15" },
        { id: "D", color: "#4ADE80" },
        { id: "F", color: "#60A5FA" }
    ],
    items: {
        "황": [
            {
                id: "11",
                title: "타코피의 원죄",
                description: "작가의 다른 작품들을 봤을 때 생각보다 매우 허술한 시나리오였을 가능성이 높지만 짧은 내용임에도 생각할 여지가 꽤 많은 만화. 스토리 자체 보다는 스토리가 진행되며 일어나는 사건과 거기서 비춰지는 인물들의 행적에 중점을 두고 봤을 때 좀 더 인상깊은 만화라고 생각함",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762546953/images/11.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762546955/thumbnails/11.jpg",
                strength: "- 매끄럽진 않지만 적당한 때에 스토리를 잘 끊어냈음\n- 가정에서 상처입은 아이들의 행동 양식이 적나라하다는 느낌이 들 정도로 잘 묘사됨",
                weakness: "",
                types: ["스릴러"]
            }
        ],
        "S": [
            {
                id: "7",
                title: "순정만화 주인공X라이벌",
                description: "순정만화 템플릿을 가져와서 백합으로 비틀어놓은 만화. 등장인물의 캐릭터성이 확고해서 짧은 호흡의 개그가 괜찮았음",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762522911/images/7.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762522915/thumbnails/7.jpg",
                strength: "- 스몰 사이즈 분량에 맞춰서 기승전결을 빠르게 끌고 간 것이 쭉쭉 읽기 좋음\n- 부담스럽지 않은 소소한 수준의 만담이 볼만함",
                weakness: "",
                types: ["백합"]
            }
        ],
        "A": [
            {
                id: "2",
                title: "카에데가미",
                description: "환단고기 때문에 한국에서 의문의 인지도를 가진 치우 신화를 기반으로 플롯 트위스팅을 한 만화. 동양 신화를 좋아해서 정말 관심있게 보고 있었으나 그대로 출하. 분위기와 볼륨 모두 '무겁다'라는 말이 어울리는 내용인데 스타트가 흔들렸던 것이 치명적으로 작용했던 것 같음. 개인적으로 출하당해서 아쉬운 만화",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762466000/images/2.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762465960/thumbnails/2.jpg",
                strength: "- 굵은 선, 강한 흑백 대비가 묵화를 연상시켜 동양풍의 느낌을 더해줌\n- 캐릭터 퀄리티가 우수함",
                weakness: "- 그림의 강악 조절이 부족하여 다소 부담스러운 부분이 있음.\n- 초반에 화제성을 모았어야 하는데 그림 날로먹을려고 했던게 치명적이었던듯",
                types: ["액션", "신화"]
            },
            {
                id: "10",
                title: "유사 하렘",
                description: "되도않는 라이벌 등장 없이 철저하게 주인공에만 포커스가 맞춰진 게 오히려 보기 드물어서 괜찮았던 만화",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762546718/images/10.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762546754/thumbnails/10.jpg",
                strength: "- 짧은 호흡의 에피소드 구성이 루즈하지 않아서 좋음\n- 시간 흐름이 분명해서 기승전결의 짜임새가 괜찮았음",
                weakness: "",
                types: []
            }
        ],
        "B": [
            {
                id: "6",
                title: "아니야, 미야하라 네가 아니라고!",
                description: "캐릭터들이 설정보다 더 어려보이는 지능을 갖고 있음. 더럽고 간사한 치정싸움없고 그냥 풋풋해서 볼 만하다",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762522330/images/6.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762522332/thumbnails/6.jpg",
                strength: "- 작화가 캐릭터성과 잘 어울림",
                weakness: "- 스토리 작가가 오늘부터 시작하는 소꿉친구 연재한다고 도망감",
                types: ["러브코미디"]
            },
            {
                id: "9",
                title: "천재 마녀의 마력 고갈",
                description: "메스가키가 아니라 메가스키다 라는 말이 유명한 만화\n천재가 힘을 잃어도 정점에 서기까지의 노력만으로도 충분히 높은 자리를 유지할 수 있다는 아이디어를 얻을 수 있어서 매우 좋았음",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762546040/images/9.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762546086/thumbnails/9.jpg",
                strength: "",
                weakness: "- 내용이 좀 쉽지 않은데 TS물약 때는 정말 힘들었음",
                types: ["러브코미디"]
            },
            {
                id: "12",
                title: "진짜로 사귀기 15분 전",
                description: "좋은 점도 나쁜 점도 딱히 없는 클래식한 러브코미디 만화. 세상이 팍팍할 때 보면 괜찮을 듯함",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762547563/images/12.jpg",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762547572/thumbnails/12.jpg",
                strength: "",
                weakness: "",
                types: ["러브코미디"]
            }
        ],
        "C": [
            {
                id: "14",
                title: " 여주 없는 세계의 악역영애는 혼약을 파기하고 강아지과 시종과 도망친다",
                description: "요즘 MZ 사이에서 유행이라는 흔한 영애물\n사실 로맨스보다는 금쪽이 동생 때문에 여주 오빠 고통받는게 재밌음",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762620229/images/14.jpg",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762620239/thumbnails/14.jpg",
                strength: "",
                weakness: "",
                types: ["로판"]
            },
            {
                id: "8",
                title: "용사라 불린 후에 -그리고 무쌍남은 가족을 만든다-",
                description: "무식하게 힘만 강한 사람들끼리 가족이 되어서 사회화가 되는 가족오락관 만화로 노선을 잡았으면 좋았겠으나 작가가 자꾸 무리수 시련 전개를 던져서 결과적으로 그닥 재미없는 만화로 기억에 남아버림",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762545367/images/8.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762545371/thumbnails/8.jpg",
                strength: "- 작화가 준수함\n- 전투 연출도 나쁘진 않은 것 같음",
                weakness: "- 전투가 나올 때마다 재미가 없음",
                types: ["판타지", "러브코미디"]
            },
            {
                id: "4",
                title: "선생님, 저는 신경쓰지 말고 가주세요!!",
                description: "어설프게 야한 만화 그리면 쓰레기 같은데 선을 아득히 넘어있어서 어이가 없어서 웃긴 만화",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762521607/images/4.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762521621/thumbnails/4.jpg",
                strength: "",
                weakness: "",
                types: ["성인", "러브코미디"]
            }
        ],
        "D": [
            {
                id: "5",
                title: "악마 여경!",
                description: "출하당하는데 그 누구도 슬퍼하지 않던 만화. 작가 이름값 때문에 그나마 이정도 버텼지 않았나...",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762521966/images/5.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762521981/thumbnails/5.jpg",
                strength: "",
                weakness: "- 만화를 얕보고 있음",
                types: ["러브코미디"]
            },
            {
                id: "16",
                title: "힘내라 동기짱",
                description: "작가의 개인 취향 충족용 스케치북",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762621238/images/16.jpg",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762621245/thumbnails/16.jpg",
                strength: "- 오피스 룩만 보면 정신을 못차리는 사람이라면 보면 됨",
                weakness: "",
                types: ["러브코미디"]
            },
            {
                id: "15",
                title: "쿠킹 걸",
                description: "이제는 고전문학이라고 봐도 될 정도로 찍어져 나온 그 시절 러브코미디\n",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762620774/images/15.jpg",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762620776/thumbnails/15.jpg",
                strength: "",
                weakness: "- 남주 여주 서사에 집중해서 요리를 열심히 했으면 좋았을 듯",
                types: ["러브코미디"]
            },
            {
                id: "3",
                title: "당겨서 안 되면 당겨보자!",
                description: "퍼리를 넘어선 파충류박이를 위한 만화\n남주가 여주 머리통 언제 씹어먹을까 궁금해서 끝까지 본 만화",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762521126/images/3.png",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762521129/thumbnails/3.jpg",
                strength: "",
                weakness: "",
                types: ["러브코미디"]
            }
        ],
        "F": [
            {
                id: "13",
                title: "두 번 다시 셀카 안 보내줘!",
                description: "이런 거 보면 머리 나빠짐",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762548478/images/13.jpg",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762548483/thumbnails/13.jpg",
                strength: "",
                weakness: "- 내용이 없음. 스토리가 빈약하다가 아니고 진짜 내용이 없음\n- 만화의 탈을 쓴 작가 팬박스 홍보용 일러스트집",
                types: ["러브코미디"]
            },
            {
                id: "17",
                title: "알 수 없는 이유로 파혼 당했습니다만, 가면 아래가 추하다니 대체 누가 그런 말을 한 걸까요?",
                description: "이런 수준의 소설도 만화로 나올 정도인거 보면 로판이 정말 잘 팔리나 봄",
                image: "https://res.cloudinary.com/do50pmbug/image/upload/v1762621646/images/17.jpg",
                thumbnail: "https://res.cloudinary.com/do50pmbug/image/upload/v1762621671/thumbnails/17.jpg",
                strength: "",
                weakness: "- 머리는 나쁘지만 피카레스크를 하고 싶었던 작가",
                types: ["로판"]
            }
        ]
    }
};

export default async (req, context) => {
    const sql = neon();

    try {
        console.log('Starting data migration...');

        const tierPriorityMap = {
            '황': 1, 'S': 2, 'A': 3, 'B': 4, 'C': 5, 'D': 6, 'F': 7
        };

        // 1. 티어 생성
        const tierIdMap = {};
        for (const tier of legacyData.tiers) {
            const [newTier] = await sql`
        INSERT INTO tiers (name, priority)
        VALUES (${tier.id}, ${tierPriorityMap[tier.id]})
        ON CONFLICT (name) DO UPDATE 
        SET priority = EXCLUDED.priority
        RETURNING id, name
      `;
            tierIdMap[tier.id] = newTier.id;
        }

        // 2. 모든 고유 태그 수집 및 생성
        const allTags = new Set();
        for (const tierName in legacyData.items) {
            for (const item of legacyData.items[tierName]) {
                if (item.types && item.types.length > 0) {
                    item.types.forEach(tag => allTags.add(tag));
                }
            }
        }

        const tagIdMap = {};
        for (const tagName of allTags) {
            const [tag] = await sql`
        INSERT INTO tags (name)
        VALUES (${tagName})
        ON CONFLICT (name) DO UPDATE 
        SET name = EXCLUDED.name
        RETURNING id, name
      `;
            tagIdMap[tagName] = tag.id;
        }

        // 3. 아이템 생성 및 관계 설정
        let totalItems = 0;

        for (const tierName in legacyData.items) {
            const items = legacyData.items[tierName];
            const tierId = tierIdMap[tierName];

            for (let position = 0; position < items.length; position++) {
                const item = items[position];

                // 아이템 생성
                const [newItem] = await sql`
          INSERT INTO items (
            title, description, strength, weakness, 
            image_url, thumbnail_url
          )
          VALUES (
            ${item.title}, ${item.description || ''}, 
            ${item.strength || ''}, ${item.weakness || ''},
            ${item.image}, ${item.thumbnail}
          )
          RETURNING id, title
        `;

                // 아이템-태그 관계
                if (item.types && item.types.length > 0) {
                    for (const tagName of item.types) {
                        await sql`
              INSERT INTO item_tags (item_id, tag_id)
              VALUES (${newItem.id}, ${tagIdMap[tagName]})
              ON CONFLICT DO NOTHING
            `;
                    }
                }

                // 티어-아이템 관계
                await sql`
          INSERT INTO tier_items (tier_id, item_id, position)
          VALUES (${tierId}, ${newItem.id}, ${position})
          ON CONFLICT (tier_id, item_id) 
          DO UPDATE SET position = ${position}
        `;

                totalItems++;
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Data migration completed',
            summary: {
                tiers: Object.keys(tierIdMap).length,
                tags: Object.keys(tagIdMap).length,
                items: totalItems
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Migration error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
