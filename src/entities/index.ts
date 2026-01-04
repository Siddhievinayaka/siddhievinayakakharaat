/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: currentprojects
 * Interface for CurrentProjects
 */
export interface CurrentProjects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectName?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType url */
  projectLink?: string;
  /** @wixFieldType image */
  projectImage?: string;
  /** @wixFieldType text */
  projectCategory?: string;
}


/**
 * Collection ID: professionalaspirations
 * Interface for ProfessionalAspirations
 */
export interface ProfessionalAspirations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  goalTitle?: string;
  /** @wixFieldType text */
  goalDescription?: string;
  /** @wixFieldType image */
  goalImage?: string;
  /** @wixFieldType number */
  priorityOrder?: number;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: professionalexperience
 * Interface for ProfessionalExperience
 */
export interface ProfessionalExperience {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType date */
  startDate?: Date | string;
  /** @wixFieldType date */
  endDate?: Date | string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType image */
  companyLogo?: string;
  /** @wixFieldType url */
  companyWebsite?: string;
}


/**
 * Collection ID: technicalskills
 * Interface for TechnicalSkills
 */
export interface TechnicalSkills {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  skillName?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType number */
  proficiencyLevel?: number;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  displayOrder?: number;
}
