export type EducationItem = {
  school: string;
  location: string;
  degree: string;
  major: string;
  gpa: string;
  dates: string;
  thesis: string;
  relevantCoursework: string;
};

export type HonorAwardItem = {
  organization: string;
  dates: string;
  bullets: string;
};

export type ExperienceItem = {
  organization: string;
  location: string;
  positionTitle: string;
  supervisor: string;
  dates: string;
  bullets: string;
};

export type LeadershipItem = {
  organization: string;
  location: string;
  role: string;
  dates: string;
  bullets: string;
};

export type SkillsData = {
  technical: string;
  language: string;
  laboratory: string;
  interests: string;
};

export type ResumeData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  education: EducationItem[];
  honorAwards?: HonorAwardItem[];
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  skills: SkillsData;
};

function escapeLatex(input: string) {
  return input
    .replaceAll("\\", "\\textbackslash{}")
    .replaceAll("&", "\\&")
    .replaceAll("%", "\\%")
    .replaceAll("$", "\\$")
    .replaceAll("#", "\\#")
    .replaceAll("_", "\\_")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("~", "\\textasciitilde{}")
    .replaceAll("^", "\\textasciicircum{}");
}

function hasText(input: string | undefined) {
  return Boolean(input && input.trim().length > 0);
}

function text(input: string | undefined) {
  return escapeLatex(input?.trim() || "");
}

function renderSectionTitle(title: string) {
  return `
\\vspace{8pt}

{\\large\\textbf{${title}}}

\\vspace{2pt}
\\hrule
\\vspace{6pt}
`;
}

function hasAnyEducationItem(item: EducationItem) {
  return (
    hasText(item.school) ||
    hasText(item.location) ||
    hasText(item.degree) ||
    hasText(item.major) ||
    hasText(item.gpa) ||
    hasText(item.dates) ||
    hasText(item.thesis) ||
    hasText(item.relevantCoursework)
  );
}

function hasAnyHonorAwardItem(item: HonorAwardItem) {
  return hasText(item.organization) || hasText(item.dates) || hasText(item.bullets);
}

function hasAnyExperienceItem(item: ExperienceItem) {
  return (
    hasText(item.organization) ||
    hasText(item.location) ||
    hasText(item.positionTitle) ||
    hasText(item.supervisor) ||
    hasText(item.dates) ||
    hasText(item.bullets)
  );
}

function hasAnyLeadershipItem(item: LeadershipItem) {
  return (
    hasText(item.organization) ||
    hasText(item.location) ||
    hasText(item.role) ||
    hasText(item.dates) ||
    hasText(item.bullets)
  );
}

function hasAnySkills(skills: SkillsData) {
  return (
    hasText(skills.technical) ||
    hasText(skills.language) ||
    hasText(skills.laboratory) ||
    hasText(skills.interests)
  );
}

function renderBulletList(input: string | undefined) {
  if (!hasText(input)) return "";

  const lines = input!
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return "";

  return `\\begin{itemize}[leftmargin=*, noitemsep, topsep=0pt, partopsep=0pt, parsep=0pt]
${lines.map((line) => `    \\item ${escapeLatex(line)}`).join("\n")}
\\end{itemize}`;
}

function renderEducationItem(item: EducationItem) {
  const school = hasText(item.school) ? text(item.school) : "University Name";
  const location = hasText(item.location) ? ` \\hfill ${text(item.location)}` : "";

  const degreeMajorText = [text(item.degree), text(item.major)]
    .filter((part) => part.trim().length > 0)
    .join(" in ");

  const degreeLine = [
    degreeMajorText,
    hasText(item.dates) ? `\\hfill ${text(item.dates)}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const gpaLine = hasText(item.gpa) ? `GPA: ${text(item.gpa)}` : "";

  const thesisLine = hasText(item.thesis) ? `Thesis: ${text(item.thesis)}` : "";

  const courseworkLine = hasText(item.relevantCoursework)
    ? `Relevant Coursework: ${text(item.relevantCoursework)}`
    : "";

  return [
    `\\textbf{${school.toUpperCase()}}${location}\\\\`,
    degreeLine ? `${degreeLine}\\\\` : "",
    gpaLine ? `${gpaLine}\\\\` : "",
    thesisLine ? `${thesisLine}\\\\` : "",
    courseworkLine ? `${courseworkLine}\\\\` : "",
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

function renderEducationSection(education: EducationItem[]) {
  const validItems = education.filter(hasAnyEducationItem);

  if (validItems.length === 0) return "";

  return `${renderSectionTitle("EDUCATION")}
${validItems.map((item) => renderEducationItem(item)).join("\n\\vspace{8pt}\n")}

\\vspace{8pt}`;
}

function renderHonorAwardItem(item: HonorAwardItem) {
  const organization = hasText(item.organization)
    ? text(item.organization)
    : "Issuing Organization";

  const dates = hasText(item.dates) ? ` \\hfill ${text(item.dates)}` : "";

  return `\\textbf{${organization.toUpperCase()}}${dates}\\\\
${renderBulletList(item.bullets)}

\\vspace{8pt}`;
}

function renderHonorAwardsSection(honorAwards: HonorAwardItem[]) {
  const validItems = honorAwards.filter(hasAnyHonorAwardItem);

  if (validItems.length === 0) return "";

  return `${renderSectionTitle("HONOR \\& AWARDS")}
${validItems.map((item) => renderHonorAwardItem(item)).join("\n")}`;
}

function renderExperienceItem(item: ExperienceItem) {
  const organization = hasText(item.organization)
    ? text(item.organization)
    : "Organization";

  const location = hasText(item.location) ? ` \\hfill ${text(item.location)}` : "";

  const position = hasText(item.positionTitle)
    ? `\\textbf{${text(item.positionTitle)}}`
    : "";

  const dates = hasText(item.dates) ? ` \\hfill ${text(item.dates)}` : "";

  const roleLine = position || dates ? `${position}${dates}\\\\` : "";

  const supervisorLine = hasText(item.supervisor)
    ? `Supervisor: ${text(item.supervisor)}\\\\`
    : "";

  return `\\textbf{${organization.toUpperCase()}}${location}\\\\
${roleLine}
${supervisorLine}
${renderBulletList(item.bullets)}

\\vspace{8pt}`;
}

function renderExperienceSection(experience: ExperienceItem[]) {
  const validItems = experience.filter(hasAnyExperienceItem);

  if (validItems.length === 0) return "";

  return `${renderSectionTitle("EXPERIENCE")}
${validItems.map((item) => renderExperienceItem(item)).join("\n")}`;
}

function renderLeadershipItem(item: LeadershipItem) {
  const organization = hasText(item.organization)
    ? text(item.organization)
    : "Organization";

  const location = hasText(item.location) ? ` \\hfill ${text(item.location)}` : "";

  const role = hasText(item.role) ? `\\textbf{${text(item.role)}}` : "";

  const dates = hasText(item.dates) ? ` \\hfill ${text(item.dates)}` : "";

  const roleLine = role || dates ? `${role}${dates}` : "";

  return `\\textbf{${organization.toUpperCase()}}${location}\\\\
${roleLine}
${renderBulletList(item.bullets)}

\\vspace{8pt}`;
}

function renderLeadershipSection(leadership: LeadershipItem[]) {
  const validItems = leadership.filter(hasAnyLeadershipItem);

  if (validItems.length === 0) return "";

  return `${renderSectionTitle("LEADERSHIP \\& ACTIVITIES")}
${validItems.map((item) => renderLeadershipItem(item)).join("\n")}`;
}

function renderSkillsSection(skills: SkillsData) {
  if (!hasAnySkills(skills)) return "";

  const lines = [
    hasText(skills.technical)
      ? `\\textbf{Technical:} ${text(skills.technical)}`
      : "",
    hasText(skills.language)
      ? `\\textbf{Language:} ${text(skills.language)}`
      : "",
    hasText(skills.laboratory)
      ? `\\textbf{Laboratory:} ${text(skills.laboratory)}`
      : "",
    hasText(skills.interests)
      ? `\\textbf{Interests:} ${text(skills.interests)}`
      : "",
  ].filter(Boolean);

  return `${renderSectionTitle("SKILLS \\& INTERESTS")}
${lines.join("\\\\\n")}`;
}

export function generateLatex(data: ResumeData) {
  const education = data.education || [];
  const honorAwards = data.honorAwards || [];
  const experience = data.experience || [];
  const leadership = data.leadership || [];
  const skills = data.skills || ({} as SkillsData);

  const contactParts = [
    hasText(data.address) ? text(data.address) : "",
    hasText(data.cityStateZip) ? text(data.cityStateZip) : "",
    hasText(data.email) ? text(data.email) : "",
    hasText(data.phone) ? text(data.phone) : "",
  ].filter(Boolean);

  return `\\documentclass[11pt]{article}
\\usepackage{graphicx}
\\setlength{\\parindent}{0pt}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{fontspec}
\\usepackage{xeCJK}
\\usepackage[left=1.06cm,top=1.7cm,right=1.06cm,bottom=0.49cm]{geometry}

\\setmainfont{Latin Modern Roman}
\\setsansfont{Latin Modern Sans}
\\setmonofont{Latin Modern Mono}

\\hypersetup{
    colorlinks=true,
    urlcolor=black
}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{${hasText(data.name) ? text(data.name) : "Firstname Lastname"}}}
\\end{center}

\\begin{center}
    ${contactParts.join(" | ")}
\\end{center}

\\vspace{2pt}

${renderEducationSection(education)}

${renderHonorAwardsSection(honorAwards)}

${renderExperienceSection(experience)}

${renderLeadershipSection(leadership)}

${renderSkillsSection(skills)}

\\end{document}`;
}
