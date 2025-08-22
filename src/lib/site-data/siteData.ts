import type { NavItem, BannerData, AboutData, ServiceData, TestimonialData, ContactData, ResumeData, SiteData } from '$lib/types';

// Navigation data
export const NAVBAR_DATA: NavItem[] = [
  { id: 1, url: '/', label: 'Home' },
  { id: 2, url: '#expertise', label: 'Expertise' },
  { id: 3, url: '#about', label: 'About Me' }
];

// Banner data
export const BANNER_DATA: BannerData = {
  HEADING: 'Alexander DiCaprio',
  SUBHEADING: 'Management Consulting, LLC',
  DESCRIPTION: 'Building human centered design around data automation.',
  LOGO: '/graphics/A_LogoV2_noname.png'
};

const ABOUT_DATA: AboutData = {
	HEADING: 'Who Am I',
	NAME: 'Alexander DiCaprio',
	TITLE: 'Chief Executive Officer',
	IMG: '/graphics/alextransparent.png',
	COMPANY: 'ADiCaprio Management Consulting, LLC.',
	ADDRESS: '1309 Coffeen Ave, STE 1200',
	CITY: 'Sheridan',
	STATE: 'WY',
	ZIP: '82801',
	DESCRIPTION: 'With over 15 years of consulting experience, I am ',
	QUALIFICATIONS: [
		'We provides Cost-Effective Digital Marketing than Others.',
		'High customer satisfaction and experience.',
		'Marketing efficiency and quick time to value.',
		'Clear & transparent fee structure.',
		'We provides Marketing automation which is an integral platform that ties all of your digital marketing together.',
		'A strong desire to establish long lasting business partnerships.',
		'Provide digital marketing to mobile consumer.',
		'We provides wide range to services in reasonable prices'
	]
};

const SERVICE_DATA: ServiceData = {
	HEADING: 'My Expertise',
	SUBHEADING: "Expanding business efficiency through work I've delivered:",
	ID: 'expertise',
	SERVICE_LIST: [
		{
			LABEL: 'Data Strategy',
			ID: 'serv-DS',
			DESCRIPTION:
				"I've led data strategy programs that put governance guardrails (standards, security, and management practices) in place, define personas, and build a culture of analysis and predictive automation. The result: proactive, data-driven decisions instead of 'gut' reactions to a changing landscape.",
			IMG: '/icons/brain.svg'
		},
		{
			LABEL: 'Data Literacy',
			ID: 'serv-DL',
			DESCRIPTION:
				"I design and roll out data literacy programs so teams can read, write, and reason with data the same way. By establishing a shared vocabulary and practices, I've helped organizations reduce internal friction and actually use their data to drive outcomes.",
			IMG: '/icons/woman student.svg'
		},
		{
			LABEL: 'Business Process Automation',
			ID: 'serv-BPA',
			DESCRIPTION:
				"I build automations so analysts spend time on analysis—not repetitive tasks. Using tools like Power Automate, I've shipped bots that enforce data standards, improve data quality, and run day-to-day processes reliably.",
			IMG: '/icons/cogwheel.svg'
		},
		{
			LABEL: 'Low-Code / No-Code',
			ID: 'serv-NC',
			DESCRIPTION:
				"I help organizations adopt the Microsoft Power Platform (Power Automate, Power Apps, Power BI) to enable citizen development—safely. I set up governance, centers of excellence, and coaching so domain experts can ship solutions faster without creating shadow IT.",
			IMG: '/icons/flask.svg'
		},
		{
			LABEL: 'SharePoint',
			ID: 'serv-SPT',
			DESCRIPTION:
				"I architect, clean up, and modernize SharePoint so it actually supports content and knowledge management. Paired with Teams and the Power Platform, I've rebuilt environments with proper administration, automation, and information architecture.",
			IMG: '/icons/note.svg'
		},
		{
			LABEL: 'Front End Web Development',
			ID: 'serv-WD',
			DESCRIPTION:
				"I design and ship scalable web apps. I work with HTML, CSS, JavaScript, and frameworks like SvelteKit (this site is one), Tailwind, and Bootstrap, and I handle deployment pipelines end-to-end.",
			IMG: '/icons/laptop front.svg'
		},
		{
			LABEL: 'Business Development',
			ID: 'serv-BD',
			DESCRIPTION:
				"I win work by investing in relationships and partnering—even with competitors when it benefits the client. I have a track record of qualifying and capturing new business and building teams from my network to deliver.",
			IMG: '/icons/stairs to success.svg'
		},
		{
			LABEL: 'Figma Design & Wireframe',
			ID: 'serv-FD',
			DESCRIPTION:
				"I use Figma to turn ideas into tangible wireframes and prototypes, aligning stakeholders early and reducing overall delivery time through fast iteration.",
			IMG: '/icons/index cards.svg'
		},
		{
			LABEL: 'Marketing Campaigns',
			ID: 'serv-MC',
			DESCRIPTION:
				"I plan and run campaigns that people actually want to engage with. From content strategy to execution, I focus on material that earns attention and gets shared.",
			IMG: '/icons/copybook.svg'
		}
	]
};

const SOCIAL_DATA = {
	HEADING: 'Find me on social media',
	SOCIALMEDIA: [
		{
			LABEL: 'LinkedIN',
			URL: 'https://www.linkedin.com/in/alexanderdicaprio/',
			IMG: '/icons/linkedin-in.svg'
		},
		{
			LABEL: 'Github',
			URL: 'https://github.com/HoneyNutz',
			IMG: '/icons/github.svg'
		},
		{
			LABEL: 'Stack Overflow',
			URL: 'https://stackoverflow.com/users/11778463/alex-dicaprio',
			IMG: '/icons/stack-overflow.svg'
		},
		{
			LABEL: 'Instagram',
			URL: 'https://www.instagram.com/honeynutz/',
			IMG: '/icons/instagram.svg'
		}
	]
};

const FOOTER_DATA = {
	DESCRIPTION:
		'We are typically focused on result-based marketing in the digital world. Also, we evaluate your brand’s needs and develop a powerful strategy that maximizes profits.',
	CONTACT_DETAILS: {
		HEADING: 'Contact us',
		ADDRESS: '1309 Coffeen Ave, STE 1200',
		MOBILE: '',
		EMAIL: ''
	},
	SUBSCRIBE_NEWSLETTER: 'Subscribe newsletter',
	SUBSCRIBE: 'Subscribe'
};

const SITE_DATA: SiteData = {
	NAVBAR_DATA,
	BANNER_DATA,
	SERVICE_DATA,
	ABOUT_DATA,
	SOCIAL_DATA,
	FOOTER_DATA
};
export default SITE_DATA;
