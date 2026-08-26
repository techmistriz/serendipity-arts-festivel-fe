import { StaticImageData } from "next/image";

export type Curator = {
  name: string;
  discipline: string;
  img: string | StaticImageData;
  short: string;
  bio: string[];
};

import { images } from "@/config/images";

export const CURATORS: Curator[] = [
  {
    name: "Salil Chaturvedi",
    discipline: "Accessibility",
    img: images.curators.salilChaturvedi,
    short: "Writer, poet, disability rights campaigner.",
    bio: [
      "Salil Chaturvedi is a writer, poet, and disability rights campaigner.",
      "His works have appeared in various literary magazines and journals. His published collections include In the Sanctuary of a Poem, Love and Longing in the Anthropocene, a little knowing and Ya Ra La Va Sha Sa Ha (in Hindi). His short story collection is titled The Inexact Room.",
      "His photographic work titled Places my chair likes to go was exhibited at the Serendipity Arts Festival 2022.",
      "He has represented India for wheelchair tennis, and in 2009 he sailed from Mumbai to Goa with a team to draw attention to accessibility issues.",
    ],
  },
  {
    name: "Anisha Rachel Oommen",
    discipline: "Culinary Arts",
    img: images.curators.anishaRachelOommen,
    short: "Founder, Goya. Food, culture, community.",
    bio: [
      "Anisha Rachel Oommen is the founder of Goya, an award-winning publication focussed on food & culture in the subcontinent.",
      "Goya operates at the intersection of culture, community, and media, using food as a medium to tell stories and create lasting cultural platforms that spotlight regional cuisines, local producers, and the knowledge systems that sustain them.",
    ],
  },
  {
    name: "Ankur Tewari",
    discipline: "Music",
    img: images.curators.ankurTewari,
    short: "Singer-songwriter. Former Creative Architect, Coke Studio Bharat.",
    bio: [
      "Ankur Tewari is one of India’s leading singer-songwriters and composers, with a career that spans independent music, cinema, and large-scale cultural projects.",
      "Known for his work in Indian pop and folk, Ankur is a Recording Academy Voting Member and the former Creative Architect of the award-winning Coke Studio Bharat, where he designed collaborations that showcased the depth and diversity of India’s music.",
      "As a music supervisor, Ankur has been part of landmark films such as Kho Gaye Hum Kahaan, Gully Boy, and The Archies, all praised for their soundtracks and their influence on how music is used in Indian cinema.",
    ],
  },
  {
    name: "Aruna Sairam",
    discipline: "Music",
    img: images.curators.arunaSairam,
    short: "Padma Shri Carnatic vocalist and composer.",
    bio: [
      "Aruna Sairam is a Padma Shri award-winning Carnatic vocalist and composer, celebrated for her rich, resonant voice, and deep command of South Indian classical traditions.",
      "Trained by her mother Rajalakshmi Sethuraman and the legendary T. Brinda, she is known for bringing bhakti, abhangs, and spiritual repertoire into contemporary concert life.",
      "A recipient of the Sangita Kalanidhi, the Sangeet Natak Akademi Award, and the Chevalier de l’Ordre des Arts et des Lettres, she is also widely respected for her philanthropy and collaborations.",
    ],
  },
  {
    name: "Ashley Lobo",
    discipline: "Dance",
    img: images.curators.ashleyLobo,
    short: "Founder-Director, Navdhara India Dance Theatre.",
    bio: [
      "Ashley Lobo is considered an influential figure in contemporary dance and a pioneer of formalised Western dance education in India. His four-decade career spans performance, choreography, and pedagogy, with over 40 film and stage works presented in India and internationally.",
      "Trained in Australia, his practice is shaped by a cross-cultural choreographic language. He is the founder-director of Navdhara India Dance Theatre, whose work has toured across 15+ countries and been presented at venues including the Suzanne Dellal Centre for Dance and Theatre (Tel Aviv), Théâtre National de Chaillot (Paris), Joburg Theatre (Johannesburg), Harbourfront Centre (Toronto), and Kampnagel (Hamburg).",
      "His work is anchored in Prana Paint, a somatic approach integrating breath, impulse, and movement. As an independent choreographer, he continues to create and collaborate internationally.",
    ],
  },
  {
    name: "Surjit Nongmeikapam",
    discipline: "Dance",
    img: images.curators.surjitNongmeikapam,
    short: "Choreographer, Imphal. Artistic Director, Nachom Arts Foundation.",
    bio: [
      "Surjit Nongmeikapam is a choreographer, performing artist, and cultural practitioner based in Imphal, Manipur, whose work reimagines traditional performance frameworks through contemporary movement.",
      "His works have received several awards, and he has presented internationally at platforms such as ImpulsTanz, Tanz im August, and Sadler’s Wells.",
      "As Artistic Director of the Nachom Arts Foundation, he is committed to nurturing a sustainable contemporary dance ecology in Manipur through artistic production, pedagogy, and institutional engagement.",
    ],
  },
  {
    name: "Anuradha Kapur",
    discipline: "Theatre",
    img: images.curators.anuradhaKapur,
    short: "Theatre-maker, teacher. Former Director, NSD.",
    bio: [
      "Anuradha Kapur is a theatre-maker and teacher. She is a founder-member of Vivadi, a cross-disciplinary group of theatre-makers, visual artists, filmmakers, musicians, and writers who seek to connect practice with research in their work. Her theatre productions have travelled both nationally and internationally.",
      "Kapur taught at the National School of Drama, New Delhi, for more than three decades and served as its Director from 2007 to 2013. She has also held visiting professorships at Ambedkar University Delhi, University of Warwick, and University of Cape Town.",
      "Her book, Actors Pilgrims Kings and Gods: The Ramlila at Ramnagar, was published by Seagull Books, Calcutta (1993; revised edition 2004). Her writings on theatre have been widely anthologised. For her contribution to theatre, she was awarded the Sangeet Natak Akademi Award for Direction in 2004.",
    ],
  },
  {
    name: "Mahesh Dattani",
    discipline: "Theatre",
    img: images.curators.maheshDattani,
    short: "Playwright, stage director, screenwriter, filmmaker.",
    bio: [
      "Mahesh Dattani is a Mumbai-based playwright, stage director, screenwriter and filmmaker. His published works include Final Solutions and Other Plays, Tara, two volumes of Collected Plays published by Penguin India and most recently Me and My Plays.",
      "His plays are produced in all the major cities of India and in UK, US, Australia, Sri Lanka, and Dubai. His plays have been translated and performed in Hindi, Gujarati, Nepali, Swedish, German, Japanese and Kannada.",
      "In 1998, Mahesh Dattani won the prestigious Central Sahitya Akademi Award, the highest award for a literary work in the country. Mahesh is the first playwright writing in English to receive this award.",
    ],
  },
  {
    name: "Sudhir Baldeo Rajbhar",
    discipline: "Craft",
    img: images.curators.sudhirRajbhar,
    short: "Interdisciplinary artist. Founder, CHAMAR.",
    bio: [
      'Sudhir Rajbhar is a Mumbai-based interdisciplinary artist, designer, and social entrepreneur renowned for founding CHAMAR — a sustainable fashion brand that reclaims the derogatory term "Chamar" and transforms it into a symbol of pride and craftsmanship.',
      "Beyond fashion, Rajbhar is dedicated to preserving the cultural heritage of leatherwork. He has received grants from institutions like the Royal Ontario Museum and the Guggenheim Museum to build an archive chronicling the history of Indian leather workers, aiming to restore the craft heritage.",
    ],
  },
  {
    name: "Kshitij Jalori",
    discipline: "Craft",
    img: images.curators.kshitijJalori,
    short: "Fashion and textile designer. Banarasi weaves, modern tailoring.",
    bio: [
      "Kshitij Jalori is a fashion and textile designer celebrated for his structural mastery of Banarasi weaves, and his exquisite embroideries which serve as a critical bridge between traditional handcraft and global luxury.",
      'Launching his eponymous label in 2019, he has built a brand identity defined by the "amalgamation of architecture, art, and culture." His work is a sophisticated dialogue between the intricate soul of Indian handlooms and the sharp, structured silhouettes of modern tailoring that fuse India\'s timeless heritage with international appeal.',
    ],
  },
  {
    name: "Latika Gupta",
    discipline: "Visual Arts",
    img: images.curators.latikaGupta,
    short: "Art historian and curator. Director, Sher-Gil Sundaram Arts Foundation.",
    bio: [
      "Latika Gupta is an art historian and curator based in Delhi. She was associate editor at MARG Publications from 2016-2020, and is currently part of the editorial collective of '100 Histories of 100 Worlds in 1 Object', and an associate editor at South Asian Studies.",
      "She has been co-mentor for the Curatorial Intensive South Asia programme (Khoj & Goethe-Institut/MMB) from 2019-2025.",
      "Latika currently works as Director, Sher-Gil Sundaram Arts Foundation and teaches courses on Trans-Himalayan visual and material cultures as visiting faculty at Ashoka University.",
    ],
  },
  {
    name: "Sheba Chhachhi",
    discipline: "Visual Arts",
    img: images.curators.shebaChhachhi,
    short: "Lens-based artist. Gender, body, city, cultural memory.",
    bio: [
      "Sheba Chhachhi’s lens-based works investigate contemporary questions about gender, the body, the city, cultural memory and eco-philosophy, through intimate, sensorial encounters.",
      "Chhachhi began as an activist and photographer documenting the women’s movement in India. By the 1990s, she moved to creating collaborative staged photographs, eventually turning to large multimedia installations. Her works retrieve marginal worlds: of women, mendicants, forgotten forms of labour, and often draw on pre-modern thought and visual histories, interweaving the mythic and the social.",
      "Chhachhi has exhibited widely in India and internationally; her works are held in significant public and private collections, including MoMA, New York, Tate Modern, UK, The Metropolitan Museum of Art, New York, and the National Gallery of Modern Art, India. She was awarded the Juror’s Prize for contemporary art in Asia by the Singapore Art Museum in 2011 and in 2018 the Thun Prize for Art & Ethics. She lives and works in New Delhi.",
    ],
  },
  {
    name: "Padmini Chettur",
    discipline: "Special Projects",
    img: images.curators.padminiChettur,
    short: "Contemporary dancer. Minimalist, abstract, formal.",
    bio: [
      "Padmini Chettur began her contemporary dance career in 1990 as a member of the troupe of Chandralekha — the radical Bharatanatyam modernist choreographer, whose own opus dealt with a rigorous deconstruction of the form.",
      "Over the past two decades, Chettur has defined her own choreographic idiom — minimalist, abstract and formal — stripping movement down to an essential, anatomical investigation, prioritising a sense of tension over emotion.",
      "She sometimes lectures and teaches. Her approach to pedagogy in the context of contemporary dance in India holds a critique of the institutional, often Eurocentric thinking around technique, aesthetic and discourse.",
      "Her most recent performative work 'Stilling' was premiered at G5A, Mumbai, in April 2024. Its video version premiered in the Dystopia Biennial 2024, Berlin. Her latest project 'Of a denser time' premiered at the Berlin Biennale 2025.",
    ],
  },
  {
    name: "Ram Rahman",
    discipline: "Special Projects",
    img: images.curators.ramRahman,
    short: "Independent photographer and curator. Founding member, SAHMAT.",
    bio: [
      "Ram Rahman is an independent photographer and curator. Ram has lived in New York and New Delhi. His photographs have been shown in India and around the world and he has curated solo exhibitions of photographers Sunil Janah, Madan Mahatta, JH Thakker, Jyoti Bhatt and others. As a founding member of the artists collective SAHMAT, the Safdar Hashmi Memorial Trust, Ram has been involved in curating exhibits and events for over 36 years.",
      "Ram’s work has been exhibited in 3 Serendipity events in Goa, The Gwangju Biennale in Korea and The Chennai Photo Biennale. Ram has lectured on Delhi’s modern architecture in Goa, MoMA in New York and in Delhi. He curated an exhibit of Delhi’s modern architecture at the KNMA in Delhi in 2000.",
      "His work is in the collections of MoMA, New York, The MET, New York, The Centre Pompidou, Paris, The Tate Modern, London, The National Museum of Asian Art, Smithsonian, Washington DC, KNMA, Delhi and Zapurza Museum in Pune, besides private collections.",
    ],
  },
  {
    name: "Sreyansi Singh",
    discipline: "Special Projects",
    img: images.curators.sreyansiSingh,
    short: "Curator and researcher. Contemporary textile art in South Asia.",
    bio: [
      "Sreyansi Singh is a curator and researcher who critically engages with contemporary textile art and clothes-making practices in South Asia.",
      "Her curatorial advocacy lies in foregrounding underrepresented and experimental approaches that inquire into the material histories and politics of the maker, while addressing both social critique and personal lived experience.",
      "Her practice is grounded in close collaboration with community stakeholders, craft custodians and interdisciplinary practitioners to build ethical, research-driven curatorial frameworks that honour labour, authorship, and shared futures within the complexities of our contemporary times.",
    ],
  },
];
