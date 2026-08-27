import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, kaushalyaStateTable } from "@workspace/db";
import {
  ApplyToJobBody,
  ApplyToJobParams,
  ApplyToJobResponse,
  CreateJobBody,
  CreateJobResponse,
  CreateTrainingProgramBody,
  CreateTrainingProgramResponse,
  GetCareerAdviceBody,
  GetCareerAdviceResponse,
  GetDistrictIntelligenceParams,
  GetDistrictIntelligenceResponse,
  GetGovernmentDashboardQueryParams,
  GetGovernmentDashboardResponse,
  GetJobMatchesParams,
  GetJobMatchesResponse,
  GetSkillForecastResponse,
  GetTraineeDashboardParams,
  GetTraineeDashboardResponse,
  GetTraineeParams,
  GetTraineeRecommendationsParams,
  GetTraineeRecommendationsResponse,
  GetTraineeResponse,
  ListDistrictsResponse,
  ListJobsQueryParams,
  ListJobsResponse,
  ListSkillDemandQueryParams,
  ListSkillDemandResponse,
  ListSkillsResponse,
  ListTrainingProgramsResponse,
  UpdateTraineeBody,
  UpdateTraineeParams,
  UpdateTraineeResponse,
} from "@workspace/api-zod";

type Dataset = {
  dashboard: unknown;
  districts: unknown[];
  demand: unknown[];
  forecast: unknown[];
  trainees: Record<string, any>;
  jobs: any[];
  skills: unknown[];
  programs: any[];
  applications: any[];
};

const districts = [
  ["Pune", "Western Maharashtra", "orange", 64200, 41100, 64, "₹5.2 LPA", "Moderate", "Very high", "Critical", "Cloud Computing", "Web Development", "High", 42, "Increase cloud training capacity by approximately 25%."],
  ["Mumbai", "Konkan", "yellow", 88400, 60100, 68, "₹6.4 LPA", "High", "Very high", "Moderate", "Cybersecurity", "Finance", "High", 35, "Expand cybersecurity and data governance pathways."],
  ["Nagpur", "Vidarbha", "orange", 37800, 22100, 58, "₹4.1 LPA", "Moderate", "High", "High", "Logistics Tech", "Manufacturing", "High", 31, "Build industry-linked programs in logistics and cloud operations."],
  ["Nashik", "North Maharashtra", "green", 31900, 21900, 69, "₹3.9 LPA", "High", "High", "Moderate", "Agritech", "Manufacturing", "Medium", 24, "Connect agritech talent with regional employers."],
  ["Chhatrapati Sambhajinagar", "Marathwada", "orange", 28400, 16100, 57, "₹3.7 LPA", "Low", "High", "High", "Electronics", "Communication", "High", 29, "Prioritize electronics and industrial automation labs."],
  ["Kolhapur", "Western Maharashtra", "green", 22600, 16100, 71, "₹3.6 LPA", "High", "Moderate", "Healthy", "Manufacturing", "Leadership", "Medium", 18, "Sustain placement momentum through employer partnerships."],
  ["Navi Mumbai", "Konkan", "yellow", 35500, 24700, 70, "₹5.8 LPA", "High", "Very high", "Moderate", "Data Science", "SQL", "High", 38, "Add applied data science cohorts for port and finance employers."],
  ["Thane", "Konkan", "yellow", 46100, 31000, 67, "₹5.1 LPA", "Moderate", "High", "Moderate", "Cloud Computing", "Digital Marketing", "High", 36, "Scale cloud and digital operations training."],
  ["Amravati", "Vidarbha", "red", 19800, 10400, 52, "₹3.2 LPA", "Low", "High", "Critical", "Solar Energy", "Communication", "Very high", 44, "Introduce green-energy labs and local apprenticeship tracks."],
  ["Solapur", "Western Maharashtra", "orange", 24600, 13900, 56, "₹3.4 LPA", "Low", "High", "High", "Textile Technology", "Manufacturing", "High", 33, "Modernize textile programs with automation and analytics."],
].map(([district, region, status, trainees, employed, placementRate, averageSalary, skillSupply, skillDemand, skillGap, topDemand, topAvailable, futureDemand, growthRate, recommendation], i) => ({
  district, region, status, trainees, employed, placementRate, averageSalary, skillSupply, skillDemand, skillGap, topDemand, topAvailable, futureDemand, growthRate, recommendation,
  coordinates: { x: 18 + (i % 5) * 16, y: 20 + Math.floor(i / 5) * 34 },
}));

const demand = [
  { skill: "Cloud Computing", category: "Technology", currentDemand: 12400, growthRate: 42, jobCount: 1840, supply: 6820, status: "rapidly-growing", region: "Maharashtra" },
  { skill: "Cybersecurity", category: "Technology", currentDemand: 8200, growthRate: 35, jobCount: 1210, supply: 4980, status: "rapidly-growing", region: "Maharashtra" },
  { skill: "Data Science", category: "Technology", currentDemand: 7600, growthRate: 29, jobCount: 1040, supply: 5220, status: "growing", region: "Maharashtra" },
  { skill: "Solar Energy", category: "Green Energy", currentDemand: 5100, growthRate: 27, jobCount: 760, supply: 2180, status: "growing", region: "Maharashtra" },
  { skill: "Full Stack Development", category: "Technology", currentDemand: 9800, growthRate: 22, jobCount: 1460, supply: 8900, status: "growing", region: "Maharashtra" },
  { skill: "Basic Data Entry", category: "Operations", currentDemand: 2100, growthRate: -12, jobCount: 390, supply: 7100, status: "declining", region: "Maharashtra" },
];

const forecast = [
  { skill: "Cloud Computing", currentDemand: 12400, predictedDemand: 18900, growthRate: 52, confidence: 91, trend: "HIGH FUTURE DEMAND", rationale: "Strong employer pull across Pune, Mumbai, and Navi Mumbai with constrained verified supply." },
  { skill: "Cybersecurity", currentDemand: 8200, predictedDemand: 11700, growthRate: 43, confidence: 87, trend: "HIGH FUTURE DEMAND", rationale: "Security hiring is accelerating across BFSI and public digital infrastructure." },
  { skill: "Data Science", currentDemand: 7600, predictedDemand: 10100, growthRate: 33, confidence: 82, trend: "GROWING", rationale: "Analytics roles are expanding as employers operationalize AI and automation." },
  { skill: "Solar Energy", currentDemand: 5100, predictedDemand: 7350, growthRate: 44, confidence: 79, trend: "GROWING", rationale: "Maharashtra’s transition investments are creating technical field roles." },
  { skill: "Basic Data Entry", currentDemand: 2100, predictedDemand: 1450, growthRate: -31, confidence: 88, trend: "DECLINING", rationale: "Automation is reducing demand for repetitive entry-only roles." },
];

const skills = [
  ["Python", "Software Development", "Programming and automation foundation", 88, 24, "Very high"],
  ["SQL", "Data Science", "Querying and modeling operational data", 84, 21, "Very high"],
  ["React", "Software Development", "Modern web application development", 79, 18, "High"],
  ["AWS", "Cloud Computing", "Cloud infrastructure and services", 94, 42, "Very high"],
  ["Docker", "Cloud Computing", "Containerized application delivery", 91, 38, "Very high"],
  ["ETL", "Data Science", "Reliable data integration pipelines", 86, 31, "High"],
  ["Cybersecurity", "Cybersecurity", "Security operations and risk controls", 92, 35, "Very high"],
  ["Communication", "Soft Skills", "Clear collaboration and stakeholder communication", 72, 12, "High"],
].map(([name, category, description, demandScore, growthRate, industryRelevance], id) => ({ id: String(id + 1), name, category, description, demandScore, growthRate, industryRelevance }));

const trainee = {
  id: "trainee-001",
  name: "Aarav Kulkarni",
  email: "aarav.kulkarni@example.com",
  phone: "+91 98765 41028",
  district: "Pune",
  state: "Maharashtra",
  education: "B.Tech · Computer Engineering",
  specialization: "Computer Engineering",
  employmentStatus: "Open to work",
  company: null,
  jobRole: null,
  salary: null,
  experience: "1 year",
  profileCompletion: 88,
  employabilityScore: 82,
  scoreClass: "High",
  skills: [
    { skill: "Python", category: "Software Development", proficiency: 90, level: "Expert", verified: true, assessmentScore: 92 },
    { skill: "SQL", category: "Data Science", proficiency: 80, level: "Advanced", verified: true, assessmentScore: 84 },
    { skill: "React", category: "Software Development", proficiency: 60, level: "Intermediate", verified: true, assessmentScore: 63 },
    { skill: "AWS", category: "Cloud Computing", proficiency: 20, level: "Beginner", verified: false, assessmentScore: 24 },
    { skill: "Docker", category: "Cloud Computing", proficiency: 8, level: "Beginner", verified: false, assessmentScore: 10 },
    { skill: "Communication", category: "Soft Skills", proficiency: 74, level: "Advanced", verified: true, assessmentScore: 78 },
  ],
};

const jobs = [
  { id: "job-001", title: "Cloud Engineer", company: "Pune Digital Systems", industry: "Technology", location: "Pune · Hybrid", jobType: "Full-time", experience: "1–3 years", salary: "₹7–10 LPA", requiredSkills: ["Python", "AWS", "Docker", "Linux"], posted: "2 days ago", deadline: "Sep 18, 2026", applicants: 42, match: 89 },
  { id: "job-002", title: "DevOps Engineer", company: "CloudScale India", industry: "Technology", location: "Navi Mumbai · Remote", jobType: "Full-time", experience: "1–3 years", salary: "₹8–12 LPA", requiredSkills: ["AWS", "Docker", "CI/CD", "Python"], posted: "4 days ago", deadline: "Sep 22, 2026", applicants: 31, match: 81 },
  { id: "job-003", title: "Backend Developer", company: "Sahyadri Labs", industry: "Technology", location: "Pune · On-site", jobType: "Full-time", experience: "0–2 years", salary: "₹6–8 LPA", requiredSkills: ["Python", "SQL", "REST APIs", "Git"], posted: "1 week ago", deadline: "Sep 12, 2026", applicants: 68, match: 74 },
  { id: "job-004", title: "Data Operations Analyst", company: "MahaFin Services", industry: "Finance", location: "Mumbai · Hybrid", jobType: "Full-time", experience: "0–2 years", salary: "₹5–7 LPA", requiredSkills: ["SQL", "Excel", "Communication"], posted: "1 week ago", deadline: "Sep 10, 2026", applicants: 53, match: 72 },
];

const programs = [
  { id: "program-001", name: "Cloud & DevOps Accelerator", institute: "Maharashtra Digital Skills Centre", description: "Industry-designed pathway from Linux fundamentals through cloud deployment.", duration: "16 weeks", mode: "Hybrid", location: "Pune", industry: "Technology", skills: ["AWS", "Docker", "Linux", "CI/CD"], capacity: 120, enrolled: 104, completionRate: 88, placementRate: 76, impactScore: 87, salary: "₹7.4 LPA avg." },
  { id: "program-002", name: "Applied Data Science", institute: "Vidarbha Analytics Institute", description: "Hands-on analytics, machine learning, and decision science for business teams.", duration: "20 weeks", mode: "Hybrid", location: "Nagpur", industry: "Technology", skills: ["Python", "SQL", "Data Science"], capacity: 90, enrolled: 82, completionRate: 84, placementRate: 71, impactScore: 82, salary: "₹6.2 LPA avg." },
  { id: "program-003", name: "Solar Technician Pathway", institute: "Green Maharashtra Mission", description: "Practical solar installation, maintenance, and safety training.", duration: "12 weeks", mode: "In-person", location: "Amravati", industry: "Green Energy", skills: ["Solar Energy", "Electrical Safety"], capacity: 80, enrolled: 74, completionRate: 91, placementRate: 69, impactScore: 80, salary: "₹4.1 LPA avg." },
];

const dashboard = {
  scope: "Maharashtra · All districts",
  updatedAt: "27 Aug 2026 · 09:42 IST",
  kpis: [
    { label: "Total trainees", value: "500", change: "+12.4%", trend: "up", detail: "active across Maharashtra" },
    { label: "Training programs", value: "20", change: "+3 this quarter", trend: "up", detail: "industry-aligned cohorts" },
    { label: "Employment outcomes", value: "320", change: "+8.2%", trend: "up", detail: "verified placements" },
    { label: "Placement rate", value: "64%", change: "+4.6 pts", trend: "up", detail: "vs. previous cohort" },
    { label: "Average salary", value: "₹4.8 LPA", change: "+11.3%", trend: "up", detail: "first-year outcome" },
    { label: "Retention rate", value: "78%", change: "+2.1 pts", trend: "up", detail: "at 6 months" },
    { label: "Top skill gap", value: "AWS", change: "Critical", trend: "neutral", detail: "7,210 learner gap" },
    { label: "Fastest growing", value: "Cloud", change: "+42%", trend: "up", detail: "12,400 open roles" },
  ],
  employmentTrend: [
    { month: "Sep '25", employed: 204, placements: 41 }, { month: "Oct", employed: 218, placements: 48 }, { month: "Nov", employed: 226, placements: 52 },
    { month: "Dec", employed: 239, placements: 57 }, { month: "Jan '26", employed: 254, placements: 63 }, { month: "Feb", employed: 269, placements: 69 },
    { month: "Mar", employed: 281, placements: 75 }, { month: "Apr", employed: 293, placements: 82 }, { month: "May", employed: 304, placements: 88 },
    { month: "Jun", employed: 312, placements: 92 }, { month: "Jul", employed: 318, placements: 97 }, { month: "Aug", employed: 320, placements: 101 },
  ],
  districtEmployment: districts.map((d: any) => ({ district: d.district, employed: d.employed, trainees: d.trainees, placementRate: d.placementRate })),
  topGaps: [
    { skill: "AWS", category: "Cloud Computing", gap: 42, demand: 12400, status: "critical" },
    { skill: "Docker", category: "Cloud Computing", gap: 36, demand: 9800, status: "critical" },
    { skill: "Cybersecurity", category: "Cybersecurity", gap: 29, demand: 8200, status: "high" },
    { skill: "ETL", category: "Data Science", gap: 24, demand: 7600, status: "high" },
    { skill: "Solar Energy", category: "Green Energy", gap: 18, demand: 5100, status: "moderate" },
  ],
  insights: [
    { title: "Cloud capacity is trailing employer demand", district: "Pune", problem: "Verified cloud talent is not keeping pace with employer demand.", evidence: "Cloud Computing demand increased 42% while verified supply grew 18%.", prediction: "Projected gap will reach 25% by the next intake if capacity is unchanged.", recommendation: "Increase cloud training capacity by approximately 25%.", impact: "Could unlock an estimated 1,800 additional placements.", tone: "amber" },
    { title: "Cybersecurity pathway showing strong outcomes", district: "Mumbai", problem: "BFSI employers need security operations talent faster than cohorts are graduating.", evidence: "35% demand growth and a 78% placement rate from the current pathway.", prediction: "Demand is expected to cross 11,700 roles in the next period.", recommendation: "Replicate the Mumbai security cohort in Navi Mumbai and Thane.", impact: "Improves regional resilience while raising placement quality.", tone: "blue" },
  ],
  programPerformance: programs.map((p) => ({ name: p.name, institute: p.institute, enrolled: p.enrolled, placementRate: p.placementRate, impactScore: p.impactScore, salary: p.salary, trend: "up" })),
};

const defaultDataset: Dataset = { dashboard, districts, demand, forecast, trainees: { [trainee.id]: trainee }, jobs, skills, programs, applications: [] };

async function getDataset(): Promise<Dataset> {
  const existing = await db.select().from(kaushalyaStateTable).where(eq(kaushalyaStateTable.key, "demo"));
  if (existing[0]) return existing[0].payload as Dataset;
  await db.insert(kaushalyaStateTable).values({ key: "demo", payload: defaultDataset });
  return defaultDataset;
}

async function saveDataset(dataset: Dataset): Promise<void> {
  await db.update(kaushalyaStateTable).set({ payload: dataset, updatedAt: new Date() }).where(eq(kaushalyaStateTable.key, "demo"));
}

const router: IRouter = Router();

router.get("/dashboard/government", async (req, res): Promise<void> => {
  const query = GetGovernmentDashboardQueryParams.parse(req.query);
  const data = await getDataset();
  const scope = query.district && query.district !== "All districts" ? data.districts.find((item: any) => item.district === query.district) : null;
  const overview = data.dashboard as any;
  const result = scope ? { ...overview, scope: `${query.district} · District intelligence`, districtEmployment: overview.districtEmployment.filter((item: any) => item.district === query.district) } : overview;
  res.json(GetGovernmentDashboardResponse.parse(result));
});

router.get("/dashboard/trainee/:traineeId", async (req, res): Promise<void> => {
  const params = GetTraineeDashboardParams.parse(req.params);
  const data = await getDataset();
  const person = data.trainees[params.traineeId] ?? trainee;
  const result = {
    trainee: person,
    totalSkills: person.skills.length,
    verifiedSkills: person.skills.filter((skill: any) => skill.verified).length,
    skillGapScore: 68,
    recommendedJobs: 4,
    recommendedTraining: 3,
    careerPaths: ["Cloud Engineer", "DevOps Engineer", "Backend Developer"],
    journey: [
      { label: "Training", detail: "Full Stack Development", status: "complete", date: "Jun 2025" },
      { label: "Assessment", detail: "6 skills assessed", status: "complete", date: "Jul 2025" },
      { label: "Certification", detail: "Web Development · verified", status: "complete", date: "Aug 2025" },
      { label: "Job search", detail: "4 high-fit roles found", status: "current", date: null },
      { label: "Employment", detail: "Your next milestone", status: "upcoming", date: null },
    ],
    recentActivity: [
      { title: "Assessment completed", detail: "AWS Fundamentals · 24/100", time: "2 days ago", tone: "amber" },
      { title: "New job match", detail: "Cloud Engineer · 89% match", time: "3 days ago", tone: "green" },
      { title: "Skill verified", detail: "SQL · Advanced proficiency", time: "1 week ago", tone: "blue" },
    ],
  };
  res.json(GetTraineeDashboardResponse.parse(result));
});

router.get("/districts", async (_req, res): Promise<void> => {
  const data = await getDataset();
  res.json(ListDistrictsResponse.parse(data.districts));
});

router.get("/districts/:district", async (req, res): Promise<void> => {
  const params = GetDistrictIntelligenceParams.parse(req.params);
  const data = await getDataset();
  const district = data.districts.find((item: any) => item.district.toLowerCase() === params.district.toLowerCase());
  if (!district) { res.status(404).json({ error: "District not found" }); return; }
  res.json(GetDistrictIntelligenceResponse.parse(district));
});

router.get("/skill-demand", async (req, res): Promise<void> => {
  const query = ListSkillDemandQueryParams.parse(req.query);
  const data = await getDataset();
  const result = data.demand.filter((item: any) => (!query.industry || item.category === query.industry) && (!query.district || item.region === query.district || query.district === "Maharashtra"));
  res.json(ListSkillDemandResponse.parse(result));
});

router.get("/forecast", async (_req, res): Promise<void> => {
  const data = await getDataset();
  res.json(GetSkillForecastResponse.parse(data.forecast));
});

router.get("/trainees/:traineeId", async (req, res): Promise<void> => {
  const params = GetTraineeParams.parse(req.params);
  const data = await getDataset();
  const person = data.trainees[params.traineeId];
  if (!person) { res.status(404).json({ error: "Trainee not found" }); return; }
  res.json(GetTraineeResponse.parse(person));
});

router.patch("/trainees/:traineeId", async (req, res): Promise<void> => {
  const params = UpdateTraineeParams.parse(req.params);
  const body = UpdateTraineeBody.parse(req.body);
  const data = await getDataset();
  const person = data.trainees[params.traineeId];
  if (!person) { res.status(404).json({ error: "Trainee not found" }); return; }
  data.trainees[params.traineeId] = { ...person, ...body };
  await saveDataset(data);
  res.json(UpdateTraineeResponse.parse(data.trainees[params.traineeId]));
});

router.get("/jobs", async (req, res): Promise<void> => {
  const query = ListJobsQueryParams.parse(req.query);
  const data = await getDataset();
  const result = data.jobs.filter((job: any) => (!query.search || `${job.title} ${job.company}`.toLowerCase().includes(query.search.toLowerCase())) && (!query.location || job.location.includes(query.location)));
  res.json(ListJobsResponse.parse(result));
});

router.post("/jobs", async (req, res): Promise<void> => {
  const body = CreateJobBody.parse(req.body);
  const data = await getDataset();
  const job = { ...body, id: `job-${Date.now()}`, posted: "Just now", applicants: 0, match: 0 };
  data.jobs.unshift(job);
  await saveDataset(data);
  res.status(201).json(CreateJobResponse.parse(job));
});

router.post("/jobs/:jobId/apply", async (req, res): Promise<void> => {
  const params = ApplyToJobParams.parse(req.params);
  const body = ApplyToJobBody.parse(req.body);
  const data = await getDataset();
  const application = { id: `application-${Date.now()}`, jobId: params.jobId, traineeId: body.traineeId, status: "submitted", createdAt: new Date().toISOString() };
  data.applications.push(application);
  data.jobs = data.jobs.map((job: any) => job.id === params.jobId ? { ...job, applicants: job.applicants + 1 } : job);
  await saveDataset(data);
  res.status(201).json(ApplyToJobResponse.parse(application));
});

router.get("/job-matches/:traineeId", async (req, res): Promise<void> => {
  const params = GetJobMatchesParams.parse(req.params);
  const data = await getDataset();
  const person = data.trainees[params.traineeId] ?? trainee;
  const skillMap = new Map<string, number>(person.skills.map((item: any) => [item.skill, item.proficiency] as [string, number]));
  const result = data.jobs.map((job: any) => {
    const matchingSkills = job.requiredSkills.filter((skill: string) => (skillMap.get(skill) ?? 0) >= 60);
    const missingSkills = job.requiredSkills.filter((skill: string) => !matchingSkills.includes(skill));
    return { ...job, matchingSkills, missingSkills, matchReason: `${matchingSkills.length} of ${job.requiredSkills.length} priority skills match your profile.` };
  });
  res.json(GetJobMatchesResponse.parse(result));
});

router.get("/skills", async (_req, res): Promise<void> => {
  const data = await getDataset();
  res.json(ListSkillsResponse.parse(data.skills));
});

router.get("/training-programs", async (_req, res): Promise<void> => {
  const data = await getDataset();
  res.json(ListTrainingProgramsResponse.parse(data.programs));
});

router.post("/training-programs", async (req, res): Promise<void> => {
  const body = CreateTrainingProgramBody.parse(req.body);
  const data = await getDataset();
  const program = { ...body, id: `program-${Date.now()}`, enrolled: 0, completionRate: 0, placementRate: 0, impactScore: 0, salary: "Pending outcomes" };
  data.programs.unshift(program);
  await saveDataset(data);
  res.status(201).json(CreateTrainingProgramResponse.parse(program));
});

router.get("/recommendations/:traineeId", async (req, res): Promise<void> => {
  const params = GetTraineeRecommendationsParams.parse(req.params);
  const data = await getDataset();
  const recommendations = [
    { id: "rec-001", type: "skill", title: "Close your AWS gap", description: "AWS is the highest-impact missing skill for Cloud Engineer roles in Pune.", action: "Start AWS Fundamentals", priority: "high" },
    { id: "rec-002", type: "training", title: "Cloud & DevOps Accelerator", description: "A 16-week hybrid program with a 76% placement rate and ₹7.4 LPA average salary.", action: "View program", priority: "high" },
    { id: "rec-003", type: "job", title: "Cloud Engineer at Pune Digital Systems", description: "Your profile is an 89% match based on Python, SQL, and communication.", action: "Review job", priority: "medium" },
  ];
  if (!data.trainees[params.traineeId] && params.traineeId !== trainee.id) { res.status(404).json({ error: "Trainee not found" }); return; }
  res.json(GetTraineeRecommendationsResponse.parse(recommendations));
});

router.post("/assistant/career-advice", async (req, res): Promise<void> => {
  const body = GetCareerAdviceBody.parse(req.body);
  const data = await getDataset();
  const person = data.trainees[body.traineeId] ?? trainee;
  const answer = body.question.toLowerCase().includes("missing") || body.question.toLowerCase().includes("gap")
    ? `Based on your ${person.district} profile, your strongest foundations are Python (${person.skills[0].proficiency}/100) and SQL (${person.skills[1].proficiency}/100). The biggest opportunity is cloud readiness: AWS and Docker are below the level requested by the fastest-growing roles.`
    : `Your profile is trending toward Cloud Engineering. With an employability score of ${person.employabilityScore}/100, focus next on AWS fundamentals, Docker, and one deployment project. Pune demand for cloud skills is up 42%, so this pathway has strong local relevance.`;
  res.json(GetCareerAdviceResponse.parse({ answer, sources: ["Your skill profile", "Pune district demand", "KAUSHALYA job matching model"], nextSteps: ["Complete AWS Fundamentals", "Build and deploy one Dockerized project", "Apply to the 89% Cloud Engineer match"] }));
});

export default router;