import type { NavItem, BannerData, AboutData, ServiceData, TestimonialData, ContactData, ResumeData, SiteData } from '$lib/types';

// Navigation data
export const NAVBAR_DATA: NavItem[] = [
  { id: 1, url: '/', label: 'Home' },
  { id: 2, url: '#services', label: 'Services' },
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
	HEADING: 'My Services',
	SUBHEADING: 'Expanding Business Efficiency Through:',
	ID: 'services',
	SERVICE_LIST: [
		{
			LABEL: 'Data Strategy',
			ID: 'serv-DS',
			DESCRIPTION:
				"As industry continues to generate more nuanced data it has become increasingly difficult to plan, manage, analyze, and react to the changing landscape within your data environment.  With a sound Data Strategy, you will build governance guardrails (including standards, security, and management practices), identify personas, build a culture of analysis and predictive automation -- enabling proactive data-driven business insights vs uninformed 'gut' reactions to changing conditions.",
			IMG: '/icons/brain.svg'
		},
		{
			LABEL: 'Data Literacy',
			ID: 'serv-DL',
			DESCRIPTION:
				'Building a culture of data requires a core ability to read, write, and work with data.  Many organizations end up battling themselves due in part to a lack of common understanding of their own data assets.  Structuring a data literacy approach is critical for organizations to mature their data capabilities and effectively implement their data strategy.',
			IMG: '/icons/woman student.svg'
		},
		{
			LABEL: 'Business Process Automation',
			ID: 'serv-BPA',
			DESCRIPTION:
				'With many organizations ineffectively utilizing business intelligence due to the shear volume of data streams, business process automation enables analysts to focus on analysis while bots govern data standards, enforce data quality, and accomplish repetitive day-to-day minutiae. Utilizing tools like Power Automate, enterprises are able to deploy process that support their analysts and reduce the overall impact of repetitive data processes.',
			IMG: '/icons/cogwheel.svg'
		},
		{
			LABEL: 'Low-Code / No-Code',
			ID: 'serv-NC',
			DESCRIPTION:
				'The Microsoft Power Platform of Applications (Power Automate, Power Apps, and Power BI) have opened the door to Citizen Development.  Investing in low-code/no-code environments allow businesses to leverage those who know their data the best to build automation, govern data, and reduce reliance on unsanctioned tools and excel spreadsheets. Managing governance practices, building centers of excellence, and enabling non-IT-trained employees to create solutions saves money, speeds up delivery and reduces the risk of shadow-IT.',
			IMG: '/icons/flask.svg'
		},
		{
			LABEL: 'SharePoint',
			ID: 'serv-SPT',
			DESCRIPTION:
				'SharePoint generally evokes a sense of despair and outrage to many -- but for the enterprise it is a necessary evil.  Building effective SharePoint platforms is key to enabling content and knowledge management.  Many times organizations release SharePoint without effective administration, forethought, or automation -- with the advent of the Power Platform and Teams  -- its time to rethink how your organize your content.',
			IMG: '/icons/note.svg'
		},
		{
			LABEL: 'Front End Web Development',
			ID: 'serv-WD',
			DESCRIPTION:
				'Building scalable web solutions to meet the needs of customers.  I am experienced in building and deploying web assets utilizing HTML, CSS (including popular CSS frameworks like Tailwind and Bootstrap), and Javascript. Additionally I have developed web applications using the latest technologies (this site itself is built on sveltekit as a proof of concept).',
			IMG: '/icons/laptop front.svg'
		},
		{
			LABEL: 'Business Development',
			ID: 'serv-BD',
			DESCRIPTION:
				'Relationships are an asset - show your clients that you value them and treat your competitors as allies. I have a strong belief that competitors working together as one team will always pay dividends in the future -- for the client, your own sanity, and future business. I bring a proven history of identifying, qualifying, and capturing new business as well as a vast network of past colleagues with the skills and capabilities for successful delivery.',
			IMG: '/icons/stairs to success.svg'
		},
		{
			LABEL: 'Figma Design & Wireframe',
			ID: 'serv-FD',
			DESCRIPTION:
				'Uninspired content becomes unused content.  Planning with a focus on Human Centered Design builds requirements that meet the needs of end users and reduces overall development time. Using wireframes solutions I work with my team to bring ideas to life.',
			IMG: '/icons/index cards.svg'
		},
		{
			LABEL: 'Marketing Campaigns',
			ID: 'serv-MC',
			DESCRIPTION:
				'Many People rely on social networks to discover, research, and educate themselves about a brand before engaging with that organization. The more your audience wants to engage with your content, the more likely it is that they will want to share it.',
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
