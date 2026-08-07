import type { StaticImageData } from "next/image";

import shaw from "@/public/images/home/testimonial/shaw.jpg";
import khanwalkar from "@/public/images/home/testimonial/khanwalkar.jpg";
import ghosh from "@/public/images/home/testimonial/ghosh.jpg";
import ojha from "@/public/images/home/testimonial/t-ojha.jpg";
import parrikar from "@/public/images/home/testimonial/parrikar.jpg";
import pradhan from "@/public/images/home/testimonial/pradhan.jpg";
import slagter from "@/public/images/home/testimonial/slagter.jpg";

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
  img?: StaticImageData;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Kiran Mazumdar Shaw",
    role: "Executive Chairperson, Biocon Biologics",
    initials: "KMS",
    img: shaw,
    quote:
      "Through this unique Science Gallery Bengaluru showcase, I want to project the mélange of the art and the science. While these two disciplines are seemingly distinct, they together embody significant creative expression. Serendipity Arts Festival is the ideal platform to showcase 'Entanglement: Dance between Art & Science' since this festival aims to break the notion of art as an isolated silo and creates space for interdisciplinary exploration of art across disciplines.",
  },

  {
    name: "Wicher Slagter",
    role: "First Secretary for Political Affairs, Press and Public Diplomacy, Netherlands Embassy in India",
    initials: "WS",
    img: slagter,
    quote:
      "The sound installation by Dutch artist, Edwin van der Heijden, showcased at the festival, was a truly unique experience. It made me aware of the power of sound and how it can convey meaning and tell a story. I am proud that the Netherlands embassy supported this project as part of its cultural program, bringing Dutch and Indian artists together.",
  },

  {
    name: "Sneha Khanwalkar",
    role: "Curator, Music and Music Director",
    initials: "SK",
    img: khanwalkar,
    quote:
      "A festival like Serendipity gives a boost to the contemporary music scene in India, ranging from sonic experiments to the introduction of new instruments, introducing audiences to endless sonic possibilities. Festivals like Serendipity offer excellent platforms to emerging talent to interact and draw inspiration from each other, for all future endeavours.",
  },

  {
    name: "Aneesh Pradhan",
    role: "Tabla Exponent and Curator, Music",
    initials: "AP",
    img: pradhan,
    quote:
      "Serendipity Arts Festival brings to the fore the possibility of reviving an interdisciplinary approach while not diluting each of the arts. As a result, practitioners and audiences can witness experimental works in this direction alongside the more traditional presentations.",
  },

  {
    name: "Late Shri Manohar Parrikar",
    role: "Former Chief Minister of Goa",
    initials: "MP",
    img: parrikar,
    quote:
      "As Goans and as a state we have true appreciation of what they have created as a world-class festival celebrating arts and culture. This has added to Goa's growing reputation as major cultural center of the country and given a big boost to tourism for Goa. Many have benefited from Serendipity Arts Festival, beyond just the art lover, to the public and has become a platform for them to experience all forms of the arts.",
  },

  {
    name: "Chandra Shekhar Ojha",
    role: "Director Sales, Kokuyo Camlin",
    initials: "CSO",
    img: ojha,
    quote:
      "I feel privileged and delighted that KCL has been a part of the Serendipity Arts Festival right from its inception. The festival offers a remarkable range of genres and activities that never fail to pleasantly surprise me with something new every time. I highly recommend everyone to experience the festival at least once.",
  },

  {
    name: "Bickram Ghosh",
    role: "Tabla Maestro and Curator, Music",
    initials: "BG",
    img: ghosh,
    quote:
      "Serendipity Arts Festival is the premier art festival in the country today, it showcases such a huge gamut of cultural aspects.",
  },
];