<script lang="ts">
  import type { ResumeData, WorkExperience } from '$lib/types/resume';
  import SITE_DATA from '$lib/site-data/siteData';
  import '@fontsource/fira-code';

  // Import JSON Resume from project content (canonical source per user preference)
  import resumeText from '../../content/resume.json?raw';
  const resume: ResumeData = JSON.parse(resumeText as unknown as string);

  let jobs: WorkExperience[] = resume.work;

  // Color Character in String -- eventually make a function
  export function colorizer(string: string, charval: string, colorval: string): string {
    const colorChar = charval;
    const colorColor = colorval;
    const characters = string.split(''); // Split the string into an array of characters

    for (let i = 0; i < characters.length; i++) {
      if (colorChar.includes(characters[i])) {
        characters[i] = `<span style=\"color: ${colorColor};\">${characters[i]}</span>`;
      }
    }
    return characters.join(''); // Join the characters back into a string
  }
</script>

<section class="bg-slate-800 text-white scroll-m-16 mb-28" id="about">
  <h2 class="text-3xl font-bold sm:text-4xl text-center">
    {SITE_DATA.ABOUT_DATA.HEADING}
  </h2>
  <div
    class=" p-3 md:max-w-screen-xl md:mx-5 xl:mx-auto bg-slate-100 md:border-4 shadow-[0_0_0_1.75rem_rgba(30,41,59,0.44)] print:border-0 page print:max-w-letter print:max-h-letter print:mx-0 print:my-o lg:h-letter md:max-w-letter md:h-letter xsm:p-8 sm:p-9 md:p-16 lg:mt-6 md:rounded-2xl print:bg-white text-slate-800"
  >
    <!-- Name ---------------------------------------------------------------------------------------------------->
    <header class="inline-flex items-baseline justify-between w-full align-top border-b-8">
      <div class="text-center lg:text-left">
        <h1 class="mb-0 text-5xl font-bold text-slate-700 drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]">
          {resume.basics.name}
        </h1>
        <!-- Label --------------------------------------------------------------------------------------------------------->
        <span
          class="m-0 text-2xl font-semibold text-slate-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] leading-snugish"
          >{@html colorizer(resume.basics.label, '|', '#FF00B4')}</span
        >

        <!-- Summary --------------------------------------------------------------------------------------------------------->
        <div class="py-5 border-b border-slate-300 lg:flex items-center">
          <img
            class="object-cover mb-5 lg:mb-0 rounded-full h-[120px] w-[120px] mx-auto p-1 border-4 border-slate-400"
            src={SITE_DATA.ABOUT_DATA.IMG}
            alt="Alex Profile Pic"
          />
          <h3 class="m-0 mr-10 lg:mr-0 ml-10 font-semibold text-md text-slate-500 leading-snugish">
            {resume.basics.summary}
          </h3>
        </div>
      </div>
    </header>

    <!-- Column -------------------------------------------------------------------------------------------------->
    <div
      class="col-gap-16 md:col-count-2 print:col-count-2 md:h-letter-col-full print:h-letter-col-full col-fill-balance"
    >
      <!--Experience ------------------------------------------------------------------------------------------------------>
      <section class="border-b-8">
        <!-- To keep in the same column -->
        <div class="break-inside-avoid">
          <h1
            class="text-slate-500 text-xl md:border-l-8 border-slate-500 md:pl-3 font-bold tracking-widest"
          >
            EXPERIENCE
          </h1>
          {#each jobs as job}
            <article class="my-5">
              <h2 class="text-xl font-bold tracking-tight leading-relaxed text-slate-700">
                {job.name}
                {@html colorizer('|', '|', '#FF00B4')}
                <span class="text-slate-400">{job.position}</span>
              </h2>
              <h3 class="text-slate-600 tracking-wide text-sm italic">
                {job.location}
                {@html colorizer('|', '|', '#ad60c7')}
                {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                {job.endDate 
                  ? new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'PRESENT'}
              </h3>
              <p class="py-1">{job.summary}</p>
            </article>
          {/each}
        </div>
      </section>

      <!--Education -------------------------------------------------------------------------------------------------------->
      <section class="border-b-4">
        <!-- To keep in the same column -->
        <div class="break-inside-avoid">
          <h1
            class="text-slate-500 text-xl md:border-l-8 border-slate-500 md:pl-3 font-bold tracking-widest"
          >
            EDUCATION
          </h1>

          {#each resume.education as school}
            <section class="pb-4 mt-4 mb-4 break-inside-avoid">
              <header>
                <h3 class="flex-grow text-lg font-semibold text-slate-700 leading-snugish">
                  {school.institution}
                </h3>
                <p class="leading-normal text-md text-slate-550">
                  <span class="font-semibold text-slate-700 text-md leading-snugish">
                    Degree:
                  </span>
                  {school.studyType}
                  {school.area} ({new Date(school.startDate).getFullYear()}-{new Date(school.endDate).getFullYear()})
                </p>
              </header>
            </section>
          {/each}
        </div>
      </section>

      <!--Projects ---------------------------------------------------------------------------------------------------------->
      <section class="pb-2 md:mt-4 border-b-4 first:mt-0">
        <div class="break-inside-avoid">
          <!-- To keep in the same column -->
          <h2 class="mb-2 text-lg font-bold tracking-widest text-slate-700 print:font-normal">
            PROJECTS
          </h2>
          <section class="pb-4 mb-4 break-inside-avoid">
            {#each resume.projects as project}
              <header>
                <h3 class="text-lg font-semibold text-slate-700 leading-snugish">
                  <a href={project.url} class="group">
                    {project.name}
                    <span
                      class="inline-block mr-3 font-normal transition duration-100 ease-in text-slate-550 print:text-black group-hover:text-slate-700"
                    >
                      ↗
                    </span>
                  </a>
                </h3>
                <p class="leading-normal text-md text-slate-550">
                  Since {project.startDate} | {#each project.keywords as keyword, i}{#if i !== 0}{', '}{/if}{keyword}{/each}
                </p>
              </header>
              <p class="mt-2.1 text-md text-slate-700 leading-normal">
                {project.description}
              </p>
            {/each}
          </section>
        </div>
      </section>

      <!--Skills ----------------------------------------------------------------------------------------------------->
      <section class="pb-4 md:mt-4 first:mt-0">
        <!-- To keep in the same column -->
        <div class="break-inside-avoid">
          <h2 class="mb-2 text-lg font-bold tracking-widest text-slate-700 print:font-normal">
            SKILLS
          </h2>

          <section class="mb-2 break-inside-avoid">
            <header>
              <h3 class="font-semibold text-slate-700 text-m leading-snugish">Functional</h3>
            </header>
            <div class="my-1 last:pb-1">
              <ul class="flex flex-wrap text-sm2 leading-relaxed -mr-1.6 -mb-1">
                {#each resume.skills as skill}
                  {#if !skill.keywords.includes('devops')}
                    <li
                      class="p-3 m-1 badge badge-ghost badge-outline text-slate-700 leading-relaxed print:bg-white print:border-inset"
                    >
                      {skill.name}
                    </li>
                  {/if}
                {/each}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </div>
    <!-- end Column -->
  </div>
  <!-- end Page -->
</section>
