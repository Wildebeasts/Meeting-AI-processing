/**
 * 5 Realistic Google Meet Test Transcripts
 * Formatted matching Google Meet's standard multi-line transcript export.
 */

export const GOOGLE_MEET_SAMPLES = [
  {
    id: "TC-01",
    name: "TC-01: Cache Arch (Terminal Consensus)",
    description: "Tests Terminal Consensus & Superseded Alternative Filter (Memcached vs Redis Cluster).",
    text: `Meeting Transcript
Date: October 13, 2026
Attendees: Alex Chen, Maya Patel, Liam Vance

Transcript
Alex Chen
08:35
Hey team, let's settle the caching layer architecture for our microservices under 50k QPS peak load. Maya, what did the initial benchmark show?

Maya Patel
09:12
I originally proposed Memcached because of its lightweight simplicity and low CPU footprint. It handles simple key-value reads nicely.

Liam Vance
11:40
Wait Maya, we hit a critical wall with Memcached in staging. It lacks native disk persistence snapshots and automated key cluster sharding. If a node drops under traffic spikes, we lose the entire session cache.

Alex Chen
14:20
Liam is right. I ran the failover benchmark against Redis Cluster with automated sentinel replication and disk snapshots. Redis Cluster handled the 50k QPS without dropping a single write.

Maya Patel
16:15
Those numbers are convincing. Given our 99.99% session persistence SLA requirement, I withdraw the Memcached proposal.

Alex Chen
18:42
Agreed then. We will adopt Redis Cluster as our official production cache tier. Memcached is officially rejected due to lack of persistence snapshots and automated replication.

Liam Vance
19:05
I'll take charge of writing the Redis sentinel deployment playbook and benchmarking the replication lag. I will finish by Friday 5 PM.`
  },
  {
    id: "TC-02",
    name: "TC-02: Incident Postmortem (Ownership Gate)",
    description: "Tests Commitment Gate, Ambiguous Pronoun resolution ('You do this ASAP'), and Sarcasm/Brainstorm filter.",
    text: `Meeting Transcript
Date: October 13, 2026
Attendees: Alex Chen, Elena Rostova, David Kim

Transcript
Alex Chen
10:00
Let's begin the Post-Mortem for yesterday's Severity-1 Payment Outage. Elena, what was the primary root cause?

Elena Rostova
10:18
The payment service database connection pool was unbounded. During the morning flash sale, connections spiked to 4,000, exhausting all MySQL worker threads and causing HTTP 500 timeouts across the checkout flow.

David Kim
11:05
Someone really ought to audit all 45 microservices in the company someday and set global limits on everything.

Alex Chen
11:45
That's a nice thought for later, but let's stay laser-focused on the immediate payment tier fix. David, can you handle the connection pool limiter?

David Kim
12:10
Yes, I will own deploying the connection pool limiter set to 150 max connections with Datadog healthcheck alerts. I will deploy it by Wednesday 17:00.

Alex Chen
12:35
Elena, you take care of updating the disaster recovery runbook and on-call escalation policy as soon as possible.`
  },
  {
    id: "TC-03",
    name: "TC-03: Mobile Strategy (Sarcasm Filter)",
    description: "Tests Sarcasm & Rhetorical Irony Rejection ('rewrite banking app in Flutter in 2 days').",
    text: `Meeting Transcript
Date: October 13, 2026
Attendees: Sarah Jenkins, Kevin Wu, Marcus Vance

Transcript
Sarah Jenkins
14:00
Let's address the mobile app performance complaints on our Android checkout flow. Frame rate drops to 24 FPS during cart checkout.

Kevin Wu
14:22
Why don't we just rewrite the entire banking application in Flutter over the weekend in 2 days? Problem solved haha!

Sarah Jenkins
14:40
Very funny Kevin, but joking aside, a complete framework rewrite is off the table and would violate all our Q4 delivery commitments. Marcus, what is the realistic technical fix?

Marcus Vance
15:15
Profiling shows the bottleneck is the JSON serialization over the JavaScript bridge in React Native. If we enable Hermes engine with pre-allocated memory buffers, CPU overhead drops by 60%.

Kevin Wu
16:02
Hermes makes total sense. Let's do that instead of touching any framework layer.

Sarah Jenkins
16:45
Decision approved: We will enable the Hermes engine and optimize JS bridge memory buffers on Android. The codebase remains on React Native.

Marcus Vance
17:10
I'll commit the Hermes configuration pull request and verify it across our device test farm by Thursday 16:00.`
  },
  {
    id: "TC-04",
    name: "TC-04: API Gateway (Deadline Sync)",
    description: "Tests Multi-Turn Deadline Negotiation Convergence (Tomorrow noon -> Next Wednesday -> Sunday 23:59 UTC).",
    text: `Meeting Transcript
Date: October 13, 2026
Attendees: Jordan Reed, Sophia Lin, Chloe Vance

Transcript
Jordan Reed
15:00
We need to finalize the cutover date to deprecate Legacy Auth API v1 and enforce Auth Gateway v2 with mTLS certificates. Sophia, can we cut over tomorrow noon?

Sophia Lin
15:25
Tomorrow noon is impossible Jordan. Three enterprise partner mobile clients haven't uploaded their RSA public keys. If we pull the plug tomorrow noon, 12,000 active sessions will be terminated.

Jordan Reed
16:10
We cannot delay forever because Security Compliance requires deprecation this month. How about next Wednesday at 10 AM?

Sophia Lin
16:45
Next Wednesday still conflicts with the marketing Black Friday campaign freeze. Can we push to the end of the week during low traffic?

Chloe Vance
17:30
How about Sunday at 23:59 UTC? Traffic is down 85% and our on-call infrastructure engineers will be on standby for the switchover.

Sophia Lin
17:55
Sunday at 23:59 UTC works perfectly for engineering and QA.

Jordan Reed
18:15
Locked in then. The definitive cutover deadline for deprecating Legacy Auth API v1 is Sunday 23:59 UTC.

Sophia Lin
18:40
I'll take ownership of sending the final deprecation notice to partner developers with the Sunday 23:59 UTC cutoff. I will send the emails today by 18:00.`
  },
  {
    id: "TC-05",
    name: "TC-05: Monorepo Debate (Stalemate Blocker)",
    description: "Tests Stalemate & Zero Hallucinated Consensus Gate ('No decision today' / 'Complete impasse').",
    text: `Meeting Transcript
Date: October 13, 2026
Attendees: VP Raymond, Tom Evans, Priya Sharma

Transcript
VP Raymond
11:00
The objective of this architecture review is to decide whether we migrate our 28 individual service repositories into a single Bazel Monorepo or remain on Polyrepos. Tom, present the infrastructure case.

Tom Evans
11:20
A Bazel Monorepo is mandatory for cross-service atomic commits and unified dependency versions. Polyrepos are causing dependency drift and broken protobuf contracts every week.

Priya Sharma
12:15
I strongly object. Our frontend build pipeline already takes 18 minutes in isolated repos. If you force frontend into Bazel, build times will balloon to 45 minutes, killing developer velocity for 60 engineers.

Tom Evans
13:10
Bazel remote caching solves build times if developers configure their local Docker environments properly!

Priya Sharma
14:00
Docker overhead on developer laptops is already at 90% RAM utilization! You cannot impose this without empirical benchmark proof!

VP Raymond
15:30
Stop team. Both sides have valid arguments, but tempers are flaring and we lack reproducible build latency telemetry. We are at a complete impasse. There is no decision today. We will not proceed with Bazel monorepo migration at this time.

VP Raymond
16:00
This remains an open blocker. Next step: Tom and Priya must jointly measure Bazel remote caching times on 3 sample services before we reconvene in Q3.`
  }
];
