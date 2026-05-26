export type EducationData = {
  university: string;
  universityLocation: string;
  degree: string;
  graduationDate: string;
  thesis: string;
  relevantCoursework: string;

  studyAbroadSchool: string;
  studyAbroadLocation: string;
  studyAbroadCoursework: string;
  studyAbroadDates: string;

  highSchoolName: string;
  highSchoolLocation: string;
  highSchoolDetails: string;
  highSchoolGraduationDate: string;
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
  education: EducationData;
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

function renderCenteredSection(title: string) {
  return `\\begin{center}
    \\textbf{${title}}
\\end{center}`;
}

function hasAnyEducationStudyAbroad(education: EducationData) {
  return (
    hasText(education.studyAbroadSchool) ||
    hasText(education.studyAbroadLocation) ||
    hasText(education.studyAbroadCoursework) ||
    hasText(education.studyAbroadDates)
  );
}

function hasAnyEducationHighSchool(education: EducationData) {
  return (
    hasText(education.highSchoolName) ||
    hasText(education.highSchoolLocation) ||
    hasText(education.highSchoolDetails) ||
    hasText(education.highSchoolGraduationDate)
  );
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

  return `\\begin{itemize}[label=-, leftmargin=*, noitemsep, topsep=0pt, partopsep=0pt, parsep=0pt]
${lines.map((line) => `    \\item ${escapeLatex(line)}`).join("\n")}
\\end{itemize}`;
}

function renderEducationSection(education: EducationData) {
  const university = hasText(education.university)
    ? text(education.university)
    : "University Name";

  const universityLocation = hasText(education.universityLocation)
    ? ` \\hfill ${text(education.universityLocation)}`
    : "";

  const degreeLine = [
    hasText(education.degree) ? text(education.degree) : "",
    hasText(education.graduationDate)
      ? `\\hfill ${text(education.graduationDate)}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const thesisLine = hasText(education.thesis)
    ? `Thesis: ${text(education.thesis)}`
    : "";

  const courseworkLine = hasText(education.relevantCoursework)
    ? `Relevant Coursework: ${text(education.relevantCoursework)}`
    : "";

  const mainEducationLines = [
    `\\textbf{${university}}${universityLocation}`,
    degreeLine,
    thesisLine,
    courseworkLine,
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n\n");

  const studyAbroadSection = hasAnyEducationStudyAbroad(education)
    ? `
\\vspace{12pt}

\\textbf{${text(education.studyAbroadSchool) || "Study Abroad"}}${
        hasText(education.studyAbroadLocation)
          ? ` \\hfill ${text(education.studyAbroadLocation)}`
          : ""
      }

${
  hasText(education.studyAbroadCoursework)
    ? `Study abroad coursework in ${text(education.studyAbroadCoursework)}`
    : ""
}${
        hasText(education.studyAbroadDates)
          ? ` \\hfill ${text(education.studyAbroadDates)}`
          : ""
      }
`
    : "";

  const highSchoolSection = hasAnyEducationHighSchool(education)
    ? `
\\vspace{12pt}

\\textbf{${text(education.highSchoolName) || "High School"}}${
        hasText(education.highSchoolLocation)
          ? ` \\hfill ${text(education.highSchoolLocation)}`
          : ""
      }

${text(education.highSchoolDetails)}${
        hasText(education.highSchoolGraduationDate)
          ? ` \\hfill ${text(education.highSchoolGraduationDate)}`
          : ""
      }
`
    : "";

  return `${renderCenteredSection("Education")}
${mainEducationLines}
${studyAbroadSection}
${highSchoolSection}

\\vspace{12pt}`;
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

  const roleLine =
    position || dates ? `${position}${dates}\\\\` : "";

  const supervisorLine = hasText(item.supervisor)
    ? `Supervisor: ${text(item.supervisor)}\\\\`
    : "";

  return `\\textbf{${organization}}${location}

${roleLine}
${supervisorLine}
${renderBulletList(item.bullets)}

\\vspace{12pt}`;
}

function renderExperienceSection(experience: ExperienceItem[]) {
  const validItems = experience.filter(hasAnyExperienceItem);

  if (validItems.length === 0) return "";

  return `${renderCenteredSection("Experience")}
${validItems.map((item) => renderExperienceItem(item)).join("\n\n")}`;
}

function renderLeadershipItem(item: LeadershipItem) {
  const organization = hasText(item.organization)
    ? text(item.organization)
    : "Organization";

  const location = hasText(item.location) ? ` \\hfill ${text(item.location)}` : "";

  const role = hasText(item.role) ? `\\textbf{${text(item.role)}}` : "";

  const dates = hasText(item.dates) ? ` \\hfill ${text(item.dates)}` : "";

  return `\\textbf{${organization}}${location}

${role}${dates}
${renderBulletList(item.bullets)}

\\vspace{12pt}`;
}

function renderLeadershipSection(leadership: LeadershipItem[]) {
  const validItems = leadership.filter(hasAnyLeadershipItem);

  if (validItems.length === 0) return "";

  return `${renderCenteredSection("Leadership \\& Activities")}

${validItems.map((item) => renderLeadershipItem(item)).join("\n\n")}`;
}

function renderSkillsSection(skills: SkillsData) {
  if (!hasAnySkills(skills)) return "";

  const lines = [
    hasText(skills.technical)
      ? `\\textbf{Technical:} ${text(skills.technical)}`
      : "",
    hasText(skills.language) ? `\\textbf{Language:} ${text(skills.language)}` : "",
    hasText(skills.laboratory)
      ? `\\textbf{Laboratory:} ${text(skills.laboratory)}`
      : "",
    hasText(skills.interests)
      ? `\\textbf{Interests:} ${text(skills.interests)}`
      : "",
  ].filter(Boolean);

  return `${renderCenteredSection("Skills \\& Interests")}

${lines.join("\n\n")}`;
}

export function generateLatex(data: ResumeData) {
  const education = data.education || ({} as EducationData);
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
    {\\LARGE \\textbf{${hasText(data.name) ? text(data.name) : "Firstname Lastname"}}}\\\\[-2pt]
    \\hrulefill
\\end{center}

\\begin{center}
    ${contactParts.join(" \\textbullet{} ")}
\\end{center}

\\vspace{0.5pt}

${renderEducationSection(education)}

${renderExperienceSection(experience)}

${renderLeadershipSection(leadership)}

${renderSkillsSection(skills)}

\\end{document}`;
}
