export const MOCK_MEETINGS = [
  {
    id: "test-case-1",
    testCaseType: "SUCCESS_CASE",
    testCaseName: "TC-01: Thay đổi phương án & Đồng thuận cuối cùng (Terminal Consensus)",
    title: "Architecture Sync: Caching & API Strategy",
    date: "Oct 24, 2024 · 14:00 - 14:45 GMT+7",
    duration: "45 mins",
    participants: [
      { name: "Alex", role: "Lead Architect", initials: "AL", color: "bg-indigo-600" },
      { name: "Lan", role: "Senior Backend", initials: "LN", color: "bg-emerald-600" },
      { name: "Nam", role: "Infra Engineer", initials: "NM", color: "bg-amber-600" },
    ],
    transcript: [
      {
        id: "t1-1",
        time: "14:10",
        speaker: "Alex",
        role: "Lead Architect",
        text: "Alright team, let's settle the caching layer for session storage and user tiering. We've been hitting limits with standalone instances. Should we pick Memcached or Redis Cluster?"
      },
      {
        id: "t1-2",
        time: "14:25",
        speaker: "Lan",
        role: "Senior Backend",
        text: "Initially I was leaning towards Memcached because of its simplicity and raw multi-threaded throughput. But taking a closer look, it lacks persistent disk snapshots and automated key eviction replication."
      },
      {
        id: "t1-3",
        time: "14:42",
        speaker: "Nam",
        role: "Infra Engineer",
        text: "I agree with Lan. If a Memcached node dies in our current setup, we lose all hot user cache immediately. Redis Cluster natively provides slot partitioning and sentinel failover."
      },
      {
        id: "t1-4",
        time: "15:10",
        speaker: "Alex",
        role: "Lead Architect",
        text: "Agreed then. Let's make the final call: We will adopt Redis Cluster across staging and production. Memcached is officially rejected due to lack of persistence and replication trade-offs."
      },
      {
        id: "t1-5",
        time: "15:25",
        speaker: "Nam",
        role: "Infra Engineer",
        text: "Got it, I'll take charge of the benchmark validation on our k8s staging cluster. I'll finish the benchmark by Friday 5 PM."
      },
      {
        id: "t1-6",
        time: "16:02",
        speaker: "Alex",
        role: "Lead Architect",
        text: "Great. Moving to the second agenda item: API gateway migration. Should we transition our REST gateway to GraphQL federation this sprint?"
      },
      {
        id: "t1-7",
        time: "16:40",
        speaker: "Lan",
        role: "Senior Backend",
        text: "Apollo federation is powerful, but our frontend and gateway teams have zero production experience with schema stitching. We might introduce major latency without query whitelisting."
      },
      {
        id: "t1-8",
        time: "17:15",
        speaker: "Alex",
        role: "Lead Architect",
        text: "That's a valid blocker. Let's keep this as an open item. We lack Apollo federation skills right now, so let's table GraphQL for next sprint review."
      }
    ],
    intelligence: {
      decisions: [
        {
          id: "dec-101",
          topic: "Production Caching Layer",
          final_decision: "Adopt Redis Cluster across staging and production environments",
          consensus_type: "EXPLICIT_TERMINAL_CONSENSUS",
          consensus_badge: "Terminal Consensus (Alex, Lan, Nam)",
          impact: "Production Tier 1 · High Impact",
          rejected_alternatives: [
            {
              option: "Memcached",
              reason: "Lacks disk persistence snapshots and automatic partition failover when nodes restart"
            }
          ],
          evidence: {
            quote: "Let's make the final call: We will adopt Redis Cluster across staging and production. Memcached is officially rejected due to lack of persistence and replication trade-offs.",
            timestamp: "15:10",
            speaker: "Alex"
          }
        }
      ],
      action_items: [
        {
          id: "act-101",
          task: "Run performance & failover benchmark for Redis Cluster on k8s staging",
          assignee: "Nam",
          deadline: "Friday 5:00 PM (Oct 27)",
          status: "PENDING",
          jira_key: "ARCH-2041",
          evidence: {
            quote: "I'll take charge of the benchmark validation on our k8s staging cluster. I'll finish the benchmark by Friday 5 PM.",
            timestamp: "15:25",
            speaker: "Nam"
          }
        }
      ],
      open_issues: [
        {
          id: "issue-101",
          topic: "GraphQL Federation vs REST Gateway Strategy",
          status: "UNRESOLVED",
          unresolved_reason: "Frontend and gateway team lack Apollo schema stitching expertise & risk query latency",
          next_steps: "Tabled for discussion in next sprint review; Alex to coordinate knowledge sharing",
          evidence: {
            quote: "We lack Apollo federation skills right now, so let's table GraphQL for next sprint review.",
            timestamp: "17:15",
            speaker: "Alex"
          }
        }
      ]
    },
    testCaseEvaluation: {
      expectation: "Hệ thống phải nhận diện được đề xuất Memcached lúc 14:10 - 14:25 đã bị loại bỏ; chỉ công nhận Redis Cluster là quyết định cuối cùng lúc 15:10 kèm lý do loại bỏ rõ ràng. Giao việc chính xác cho Nam có deadline thứ Sáu 17h.",
      actualResult: "Trích xuất đúng 100% quyết định Redis Cluster; đưa Memcached vào rejected_alternatives; gán task benchmark cho Nam kèm deadline chuẩn; tách GraphQL thành open_issue thay vì bịa ra quyết định.",
      status: "ĐẠT (PASS)",
      learning: "Quy tắc Terminal Consensus + Topic Segmentation giải quyết triệt để bài toán đổi ý trong cuộc họp kỹ thuật khi người chủ trì chốt rõ ràng."
    }
  },
  {
    id: "test-case-2",
    testCaseType: "DIFFICULT_CASE",
    testCaseName: "TC-02: Tình huống khó — Đồng thuận ngầm & Đại từ mơ hồ (Ambiguous Pronouns)",
    title: "Billing Service Incident Post-Mortem",
    date: "Oct 25, 2024 · 09:30 - 10:00 GMT+7",
    duration: "30 mins",
    participants: [
      { name: "Sarah", role: "Engineering Manager", initials: "SR", color: "bg-purple-600" },
      { name: "Duc", role: "DevOps Engineer", initials: "DC", color: "bg-blue-600" },
      { name: "Mai", role: "QA Lead", initials: "MI", color: "bg-rose-600" }
    ],
    transcript: [
      {
        id: "t2-1",
        time: "09:35",
        speaker: "Sarah",
        role: "Engineering Manager",
        text: "Yesterday's payment webhook dropped 120 transactions during the TLS cert renewal. What do we do to prevent this?"
      },
      {
        id: "t2-2",
        time: "09:41",
        speaker: "Duc",
        role: "DevOps Engineer",
        text: "We should set up cert-manager automated rotation instead of manual Secret updates in kubectl."
      },
      {
        id: "t2-3",
        time: "09:48",
        speaker: "Sarah",
        role: "Engineering Manager",
        text: "Sounds good. You take care of this as soon as possible."
      },
      {
        id: "t2-4",
        time: "09:52",
        speaker: "Mai",
        role: "QA Lead",
        text: "Should we also write synthetic tests for webhook expiration?"
      },
      {
        id: "t2-5",
        time: "09:55",
        speaker: "Duc",
        role: "DevOps Engineer",
        text: "Yeah, someone really ought to look into that someday."
      },
      {
        id: "t2-6",
        time: "09:58",
        speaker: "Sarah",
        role: "Engineering Manager",
        text: "Okay, let's wrap up."
      }
    ],
    intelligence: {
      decisions: [
        {
          id: "dec-201",
          topic: "TLS Certificate Renewal Policy",
          final_decision: "Implement cert-manager automated rotation for Kubernetes secrets",
          consensus_type: "ASSUMED_NO_OBJECTION",
          consensus_badge: "Đồng thuận ngầm (Implicit Consensus)",
          impact: "Reliability & SecOps · Critical",
          rejected_alternatives: [
            {
              option: "Manual Secret updates via kubectl",
              reason: "Human error caused 120 dropped transactions during renewal"
            }
          ],
          evidence: {
            quote: "We should set up cert-manager automated rotation instead of manual Secret updates in kubectl.",
            timestamp: "09:41",
            speaker: "Duc"
          }
        }
      ],
      action_items: [
        {
          id: "act-201",
          task: "Configure automated cert-manager rotation on production clusters",
          assignee: "Duc (Suy đoán từ lượt thoại liền kề)",
          deadline: "ASAP (Cần con người gán ngày cụ thể)",
          status: "PENDING",
          jira_key: "OPS-910",
          evidence: {
            quote: "Sounds good. You take care of this as soon as possible.",
            timestamp: "09:48",
            speaker: "Sarah"
          }
        }
      ],
      open_issues: [
        {
          id: "issue-201",
          topic: "Synthetic tests for webhook expiration",
          status: "UNRESOLVED",
          unresolved_reason: "Ý kiến đề xuất mơ hồ ('someone really ought to look into that someday') không có cam kết trách nhiệm",
          next_steps: "Cần đưa vào backlog để PM chỉ định QA chịu trách nhiệm chính thức",
          evidence: {
            quote: "Yeah, someone really ought to look into that someday.",
            timestamp: "09:55",
            speaker: "Duc"
          }
        }
      ]
    },
    testCaseEvaluation: {
      expectation: "Không bịa ra deadline cụ thể khi chỉ có 'as soon as possible'. Xử lý đại từ 'You' bằng cách liên kết với Duc ở phát ngôn trước. Không biến câu bộc phát 'someone ought to do that someday' thành task có người nhận.",
      actualResult: "Hệ thống gán nhãn assignee là 'Duc (Suy đoán)' và gắn cờ cảnh báo deadline mơ hồ; câu nói của Mai/Duc được đưa vào open_issues thay vì tạo task rác.",
      status: "ĐẠT (PASS CÓ CẢNH BÁO)",
      learning: "Khi phát hiện đại từ không định danh ('you', 'someone') hoặc thời hạn mơ hồ ('ASAP', 'someday'), hệ thống bắt buộc kích hoạt cờ 'Pending Review' để con người can thiệp."
    }
  },
  {
    id: "test-case-3",
    testCaseType: "FAILED_CASE",
    testCaseName: "TC-03: Tình huống thất bại — Tranh luận mỉa mai (Sarcasm) & Đổi ý phút chót không rõ lời",
    title: "Mobile App Release 2.4 Scope Debate",
    date: "Oct 26, 2024 · 16:00 - 16:30 GMT+7",
    duration: "30 mins",
    participants: [
      { name: "Bao", role: "Product Manager", initials: "BO", color: "bg-red-600" },
      { name: "Hoa", role: "Lead Mobile Dev", initials: "HA", color: "bg-indigo-600" },
      { name: "Tuan", role: "Designer", initials: "TN", color: "bg-teal-600" }
    ],
    transcript: [
      {
        id: "t3-1",
        time: "16:05",
        speaker: "Bao",
        role: "Product Manager",
        text: "Marketing wants to ship the new Dark Mode revamp in version 2.4 this Thursday."
      },
      {
        id: "t3-2",
        time: "16:12",
        speaker: "Hoa",
        role: "Lead Mobile Dev",
        text: "Oh sure, why don't we also rewrite the whole app in Flutter while we're at it? That will totally take 2 days."
      },
      {
        id: "t3-3",
        time: "16:16",
        speaker: "Bao",
        role: "Product Manager",
        text: "Wait, are you being serious or sarcastic?"
      },
      {
        id: "t3-4",
        time: "16:20",
        speaker: "Hoa",
        role: "Lead Mobile Dev",
        text: "Sarcastic! The dark mode theme engine has 40 unmerged tokens. Thursday is impossible without crash spikes."
      },
      {
        id: "t3-5",
        time: "16:24",
        speaker: "Bao",
        role: "Product Manager",
        text: "Fine. Let's delay Dark Mode to v2.5. But we MUST release bug fixes for login on Thursday. Agreed?"
      },
      {
        id: "t3-6",
        time: "16:27",
        speaker: "Hoa",
        role: "Lead Mobile Dev",
        text: "Whatever works. Just don't blame me if QA is crying."
      }
    ],
    intelligence: {
      decisions: [
        {
          id: "dec-301",
          topic: "Release 2.4 Scope & Dark Mode",
          final_decision: "Hoãn Dark Mode sang bản 2.5; Bản 2.4 chỉ phát hành các bản vá lỗi Login vào thứ Năm",
          consensus_type: "COMPROMISE_RELUCTANT",
          consensus_badge: "Đồng thuận miễn cưỡng (Reluctant Agreement)",
          impact: "Release Milestone · High Risk",
          rejected_alternatives: [
            {
              option: "Phát hành Dark Mode trong bản 2.4 vào thứ Năm",
              reason: "Theme engine còn 40 token chưa merge, nguy cơ crash app cao"
            },
            {
              option: "Viết lại app bằng Flutter",
              reason: "[LỖI AI TRÍCH XUẤT NHẦM] AI từng hiểu nhầm câu mỉa mai thành đề xuất nghiêm túc"
            }
          ],
          evidence: {
            quote: "Fine. Let's delay Dark Mode to v2.5. But we MUST release bug fixes for login on Thursday.",
            timestamp: "16:24",
            speaker: "Bao"
          }
        }
      ],
      action_items: [
        {
          id: "act-301",
          task: "Chuẩn bị bản build vá lỗi Login cho Release 2.4",
          assignee: "Hoa (Chưa cam kết tự nguyện)",
          deadline: "Thứ Năm (Oct 28)",
          status: "PENDING",
          jira_key: "MOB-110",
          evidence: {
            quote: "Whatever works. Just don't blame me if QA is crying.",
            timestamp: "16:27",
            speaker: "Hoa"
          }
        }
      ],
      open_issues: [
        {
          id: "issue-301",
          topic: "Nguy cơ quá tải thời gian kiểm thử QA trước thứ Năm",
          status: "BLOCKED",
          unresolved_reason: "Lead Dev cảnh báo tâm lý phản ứng 'don't blame me if QA is crying' cho thấy chưa có cam kết chất lượng ổn định",
          next_steps: "Cần PM làm việc trực tiếp với QA Lead để xác nhận kế hoạch test",
          evidence: {
            quote: "Just don't blame me if QA is crying.",
            timestamp: "16:27",
            speaker: "Hoa"
          }
        }
      ]
    },
    testCaseEvaluation: {
      expectation: "Hệ thống phải lọc bỏ câu nói đùa/mỉa mai về Flutter, không biến nó thành đề xuất kỹ thuật; phát hiện thái độ 'Whatever works' là đồng thuận miễn cưỡng.",
      actualResult: "CHƯA TỐT / GẶP LỖI: Ở phiên bản prompt gốc, AI trích xuất 'Rewrite app in Flutter' thành một phương án bị loại bỏ (hoặc thậm chí đề xuất task). Đến khi người dùng can thiệp và thêm bộ lọc sarcasm thì mới sửa lại được.",
      status: "CHƯA ĐẠT BAN ĐẦU $\\to$ ĐÃ SỬA CÓ HẠN CHẾ (FAIL-CASE)",
      learning: "Ngữ nghĩa mỉa mai (Sarcasm, Irony) và phản ứng tiêu cực là vùng dễ sai số nhất của LLM. Cần bổ sung quy tắc phát hiện giọng điệu hoài nghi và bắt buộc đối chiếu giải thích ở lượt thoại kế tiếp."
    }
  },
  {
    id: "test-case-4",
    testCaseType: "COMPLEX_CASE",
    testCaseName: "TC-04: Đàm phán Deadline 3 lượt (Multi-turn Deadline Negotiation)",
    title: "Core Banking Security Audit Remediation",
    date: "Oct 27, 2024 · 10:00 - 10:35 GMT+7",
    duration: "35 mins",
    participants: [
      { name: "Khang", role: "Security Lead", initials: "KG", color: "bg-red-700" },
      { name: "Trang", role: "Backend Lead", initials: "TG", color: "bg-indigo-700" },
      { name: "Vinh", role: "CISO", initials: "VH", color: "bg-slate-700" }
    ],
    transcript: [
      {
        id: "t4-1",
        time: "10:05",
        speaker: "Khang",
        role: "Security Lead",
        text: "The external penetration test discovered 3 high-severity SQL injections in legacy reporting queries. We need these patched by tomorrow noon."
      },
      {
        id: "t4-2",
        time: "10:11",
        speaker: "Trang",
        role: "Backend Lead",
        text: "Tomorrow noon is totally unfeasible. Those queries touch our financial reconciliation ledger. If we rush, we break balance audits. We need until next Wednesday."
      },
      {
        id: "t4-3",
        time: "10:19",
        speaker: "Vinh",
        role: "CISO",
        text: "Next Wednesday is unacceptable to the State Bank compliance audit. The maximum extension I can grant is this Sunday 23:59 before the weekly maintenance window."
      },
      {
        id: "t4-4",
        time: "10:28",
        speaker: "Trang",
        role: "Backend Lead",
        text: "Okay. If the team works overtime on Saturday, Sunday 23:59 is doable. I will own the patch and hotfix deployment personally."
      },
      {
        id: "t4-5",
        time: "10:32",
        speaker: "Vinh",
        role: "CISO",
        text: "Locked in. Sunday 23:59 is the hard deadline."
      }
    ],
    intelligence: {
      decisions: [
        {
          id: "dec-401",
          topic: "Deadline khắc phục lỗ hổng SQL Injection kiểm toán",
          final_decision: "Chốt hoàn thành vá lỗi và hotfix chậm nhất trước 23:59 Chủ Nhật (Oct 29)",
          consensus_type: "EXPLICIT_TERMINAL_CONSENSUS",
          consensus_badge: "Chốt cứng (Hard Deadline Lock)",
          impact: "Compliance & Security · Critical P0",
          rejected_alternatives: [
            {
              option: "Trưa mai (Thứ Sáu)",
              reason: "Trang bác bỏ vì không đủ thời gian kiểm thử đối soát tài chính ledger"
            },
            {
              option: "Thứ Tư tuần sau",
              reason: "CISO Vinh bác bỏ vì vi phạm hạn định kiểm toán của Ngân hàng Nhà nước"
            }
          ],
          evidence: {
            quote: "Locked in. Sunday 23:59 is the hard deadline.",
            timestamp: "10:32",
            speaker: "Vinh"
          }
        }
      ],
      action_items: [
        {
          id: "act-401",
          task: "Vá 3 lỗi SQL injection và triển khai hotfix ledger lên staging & production",
          assignee: "Trang",
          deadline: "Chủ Nhật 23:59 (Oct 29)",
          status: "PENDING",
          jira_key: "SEC-409",
          evidence: {
            quote: "Sunday 23:59 is doable. I will own the patch and hotfix deployment personally.",
            timestamp: "10:28",
            speaker: "Trang"
          }
        }
      ],
      open_issues: []
    },
    testCaseEvaluation: {
      expectation: "Hệ thống phải bắt được 3 mốc deadline (Trưa mai $\\to$ Thứ Tư tuần sau $\\to$ Chủ Nhật 23:59) và chỉ giữ lại mốc Chủ Nhật 23:59 cho task của Trang; các mốc trước đó phải ghi vào lịch sử bác bỏ.",
      actualResult: "Bóc tách chính xác 100% deadline cuối cùng, không bị nhầm lẫn với 2 mốc đàm phán trung gian. Gán đúng người phụ trách là Trang.",
      status: "ĐẠT (PASS)",
      learning: "Dòng thời gian đối thoại thể hiện rõ mô hình thỏa hiệp (compounding constraints). Bắt chốt ở phát ngôn có từ khóa xác nhận cao ('Locked in', 'hard deadline')."
    }
  },
  {
    id: "test-case-5",
    testCaseType: "UNRESOLVED_CASE",
    testCaseName: "TC-05: Cuộc họp bế tắc & Không đạt đồng thuận (Stalemate / No Consensus)",
    title: "Design System UI Framework Migration",
    date: "Oct 28, 2024 · 15:00 - 15:30 GMT+7",
    duration: "30 mins",
    participants: [
      { name: "Phuong", role: "Design Lead", initials: "PH", color: "bg-pink-600" },
      { name: "Khoa", role: "Frontend Lead", initials: "KH", color: "bg-cyan-600" },
      { name: "Lam", role: "VP of Engineering", initials: "LM", color: "bg-slate-800" }
    ],
    transcript: [
      {
        id: "t5-1",
        time: "15:02",
        speaker: "Phuong",
        role: "Design Lead",
        text: "Our design team has completely standardized our Figma tokens on Tailwind 4. We propose rewriting the web frontend to Tailwind."
      },
      {
        id: "t5-2",
        time: "15:10",
        speaker: "Khoa",
        role: "Frontend Lead",
        text: "I strongly oppose this. We have 250 enterprise pages on styled-components. Rewriting is a 6-month sinkhole with zero user ROI."
      },
      {
        id: "t5-3",
        time: "15:20",
        speaker: "Phuong",
        role: "Design Lead",
        text: "If we don't, our design consistency will continuously drift apart and dev handoff takes double the time."
      },
      {
        id: "t5-4",
        time: "15:27",
        speaker: "Lam",
        role: "VP of Engineering",
        text: "We are at complete impasse and running out of time. No decision today. I will schedule a formal architecture review next week with customer metrics."
      }
    ],
    intelligence: {
      decisions: [],
      action_items: [
        {
          id: "act-501",
          task: "Thu thập dữ liệu đo lường tốc độ phát triển thực tế giữa styled-components và Tailwind",
          assignee: "Khoa & Phuong",
          deadline: "Trước buổi review tuần tới",
          status: "PENDING",
          jira_key: "DES-332",
          evidence: {
            quote: "I will schedule a formal architecture review next week with customer metrics.",
            timestamp: "15:27",
            speaker: "Lam"
          }
        }
      ],
      open_issues: [
        {
          id: "issue-501",
          topic: "Tailwind CSS vs Styled-Components Migration",
          status: "BLOCKED",
          unresolved_reason: "Bất đồng quan điểm sâu sắc: Design Lead muốn tính đồng bộ Figma; Frontend Lead lo ngại chi phí làm lại 250 màn hình",
          next_steps: "VP Lam chủ trì Architecture Review tuần sau có số liệu định lượng",
          evidence: {
            quote: "We are at complete impasse and running out of time. No decision today.",
            timestamp: "15:27",
            speaker: "Lam"
          }
        }
      ]
    },
    testCaseEvaluation: {
      expectation: "Hệ thống TUYỆT ĐỐI KHÔNG sinh ra quyết định 'Chuyển sang Tailwind' hoặc 'Giữ nguyên styled-components'. Bắt buộc đưa vào open_issues với trạng thái BLOCKED.",
      actualResult: "Mảng decisions hoàn toàn rỗng `[]`; nhận diện đúng trạng thái tranh cãi chưa ngã ngũ; trích xuất lý do mâu thuẫn chính xác.",
      status: "ĐẠT (PASS)",
      learning: "Ngăn chặn việc suy diễn quá mức (over-generation). Khi người chủ trì tuyên bố 'No decision today', hệ thống bảo vệ tri thức bằng cách tôn trọng trạng thái chưa chốt."
    }
  }
];
