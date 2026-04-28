import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const Academics = () => {
  const overviewItems = [
    'Holistic education',
    'Continuous and Comprehensive Evaluation (CCE)',
    'Project Base Learning (PBL)',
    'Enrichment / Remedial Classes and hand writing Improvement',
    'Compulsory Yoga',
    'Counseling and Career Guidance',
    'Indian Festival Celebration',
    'Life Skills',
    'Teachers with passion for teaching with commitment and patience',
    'Digital and multi-media classroom teaching technologies',
    'English Language Lab',
    'Preparation for competitive exams',
    'Foundation Classes for IIT & Medical',
    'Music & Dance Classes',
    'Arts & Crafts Classes',
    'Library with 1000 books and e-Library',
    'Well sofisticated Computer Lab',
    'Well equiped Integrated Practical Science Lab facility',
    'Maintain health consciousness and hygiene',
    'Latest information technology skills',
    'Practice innovation in learning methodologies',
    'Orientation to Entrepreneurship Development',
    'Educational Field Trips',
    'Disaster management',
    'Meet Global challenges',
    'Provide Value Education',
    'Develop Logical thinking and scientific aptitude',
    'Facilitate Creativity and Excellence',
    'Focus on Personality Development through self drive project',
    'Cope with development of science and technology',
    'Appreciate, nature and inculcate aesthetic sense',
    'Partnering with Parents',
    'Staff Enrichment Program',
    'Integrated Syllabus',
    'Micro Annual Plan',
    'Guided Study Hours (SLIP)',
    'Unique Examination System',
    'Weekly Assessment',
    'Sports, Games & Extra Curricular Activities',
  ]

  const examinationBoard = [
    'M. SUDHA RANI - M.Sc. B.Ed.',
    'P. RAJINI - M.Sc. B.Ed.',
    'G. KARUNA KUMARI - M.A. T.P.T.',
  ]

  const examinationPattern = [
    'SLIP TESTS',
    'WEEKEND TESTS',
    'FARMATIVE ASSESSMENT EXAMINATIONS-I, II, III & IV',
    'SAMMATIVE ASSESSMENT EXAMINATIONS-I, II & III',
    'A student requires minimum 40% marks to pass in each test.',
    'It is mandatory for a student to pass separately in Theory and Practical Exams.',
    'Regularity in tests/ exams is a must for the students.',
    'No change of subject or stream will be allowed after July.',
    'Students must not resort to any unfair means in any test or examination.',
  ]

  return (
    <>
      <Helmet>
        <title>Academics | Winfield High School</title>
        <meta name="description" content="Academics | Winfield High School | khammam - Telangana" />
      </Helmet>

      <section className="py-20 bg-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-purple-700 mb-8 leading-tight">
              ACADEMICS
            </h1>
          </motion.div>

          {/* OVERVIEW Section - Premium Card with Icon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 hover:shadow-medium transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-purple-700 leading-tight">
                  OVERVIEW:
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overviewItems.map((item, index) => (
                  <li key={index} className="text-gray-700 font-body text-base flex items-start leading-relaxed">
                    <span className="text-purple-600 mr-3 text-lg font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ACADEMIC STAFF Section - Premium Card with Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 hover:shadow-medium transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-purple-700 leading-tight">
                  ACADEMIC STAFF
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 font-body text-base leading-loose">
                  All members of the WHS faculty are professionally qualified teachers, having either Graduate or Post Graduate qualifications in Education ( B.Ed/M.Ed). More than all our teachers are Post Graduate and all of them are extremely well qualified in their subjects. All teachers have relevant teaching experience at leading schools.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  The teaching fraternity at WHS is a highly qualified team of individuals from different part of the state The teachers will play dynamic role in the functioning of the school and contribute significantly to the gamut of activities before, during after school .
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  The well-trained faculty aims to function as 'Facilitators' in academics and maintain an open communication system with the children.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  The institution places a lot of emphasis on continuous professional development and skills upgrade of staff. Regular in-house and external training programmes have been planned for WHS staff. Periodic reviews and meetings will be held to assess individual as well as organizational goals. This is to ensure that the system constantly evolves to accommodate fresh perspective and adapts to change.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  WHS teachers are well-equipped to integrate technology in the classroom and use it effectively to plan lessons and prepare assessment reports. Access to a large pool of teaching resources ensures that teachers are abreast with the latest trends in the teaching-learning process and are able to implement them
                </p>
              </div>
            </div>
          </motion.div>

          {/* ACADEMIC DEPARTMENT Section - Premium Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 hover:shadow-medium transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🏛️</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-purple-700 leading-tight">
                  ACADEMIC DEPARTMENT
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 font-body text-base leading-loose">
                  As a forward thinking, academic-centric, WHS strives for securing innovativeness, effectiveness and practicality in its curricula; supported by a wide range of extra and co-curricular activities.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  The Management, Heads of Faculty and Academic Examination Board hold constant dialogues among themselves, parents and students to ensure that while the required academic standards are met, the 'joy of learning' is not sacrificed.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  There are six faculties at WHS: English, Mathematics, Modern & Classical Languages, Science & Information Technology, Humanities, and Expressive Arts. Faculty Heads work to ensure that the school provides a professional, lively and encouraging environment for nurturing young minds.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  Regular meetings by the faculty and members of Academic Examination Board monitor the progress made in each department at various levels: Pre-primary, Primary, Middle and Secondary.
                </p>
                <p className="text-gray-700 font-body text-base leading-loose">
                  Intense discussions and deliberations take place to review the curriculum, methodology, suitability of evaluation tools, performance of students in various assessments, adoption of best practices among international schools, and efficacy of the non-formal learning practices.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ACADEMIC EXAMINATION BOARD Section - Premium Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 hover:shadow-medium transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📋</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-purple-700 leading-tight">
                  ACADEMIC EXAMINATION BOARD
                </h2>
              </div>
              <div className="space-y-8">
                <p className="text-gray-700 font-body text-base leading-loose">
                  The Academic and Examinations Board of WHS is represented by academicians with distinguished and credible experience in the field of education. Under their able guidance and leadership, WHS campuses in Mamata Hospital Road have grow from strength to strength with proven results by winning accolades for best quality practices and securing exemplary student achievements in both, academics and co-curricular activities.
                </p>
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-heading font-bold text-purple-700 mb-4">Board Members:</h3>
                  <ul className="space-y-3">
                    {examinationBoard.map((member, index) => (
                      <li key={index} className="text-gray-700 font-body text-lg font-semibold leading-relaxed">
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* EXAMINATION PATTERN Section - Premium Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 hover:shadow-medium transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">✏️</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-purple-700 leading-tight">
                  EXAMINATION PATTERN
                </h2>
              </div>
              <div className="space-y-8">
                <p className="text-gray-700 font-body text-base leading-loose">
                  The students will be assessed regularly through :
                </p>
                <ul className="space-y-4">
                  {examinationPattern.map((item, index) => (
                    <li key={index} className="text-gray-700 font-body text-base flex items-start leading-relaxed">
                      <span className="text-purple-600 mr-3 text-lg font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* PATTERN OF QUESTION PAPERS Section - Premium Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 hover:shadow-medium transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-purple-700 leading-tight">
                  PATTERN OF QUESTION PAPERS
                </h2>
              </div>
              <ul className="space-y-4">
                <li className="text-gray-700 font-body text-base flex items-start leading-relaxed">
                  <span className="text-purple-600 mr-3 text-lg font-bold">•</span>
                  The Final Examination will be based on the complete syllabus.
                </li>
                <li className="text-gray-700 font-body text-base flex items-start leading-relaxed">
                  <span className="text-purple-600 mr-3 text-lg font-bold">•</span>
                  The question papers will be based on Board pattern (CCE) and as per the STATE syllabus. Students will thus be trained for the Board exams.
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Academics
