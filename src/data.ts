// Single source of truth for categories. Mirrors fiverr-api/utils/categories.js
// — the slugs must match or filtering silently returns nothing.
// Previously the gig form offered 4 values while the navbar and home page
// advertised ten unrelated ones, so no link ever matched a real gig.
export type Category = {
  cat: string;
  title: string;
  desc: string;
  img: string;
  icon: string;
};

export const categories: Category[] = [
  {
    cat: "graphics-design",
    title: "Graphics & Design",
    desc: "Build your brand",
    img: "https://images.pexels.com/photos/11295165/pexels-photo-11295165.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg",
  },
  {
    cat: "digital-marketing",
    title: "Digital Marketing",
    desc: "Reach more customers",
    img: "https://images.pexels.com/photos/11378899/pexels-photo-11378899.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg",
  },
  {
    cat: "writing-translation",
    title: "Writing & Translation",
    desc: "Share your message",
    img: "https://images.pexels.com/photos/7608079/pexels-photo-7608079.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg",
  },
  {
    cat: "video-animation",
    title: "Video & Animation",
    desc: "Engage your audience",
    img: "https://images.pexels.com/photos/13388047/pexels-photo-13388047.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/video-animation.f0d9d71.svg",
  },
  {
    cat: "music-audio",
    title: "Music & Audio",
    desc: "Give your project a voice",
    img: "https://images.pexels.com/photos/4088801/pexels-photo-4088801.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg",
  },
  {
    cat: "programming-tech",
    title: "Programming & Tech",
    desc: "Customize your site",
    img: "https://images.pexels.com/photos/4371669/pexels-photo-4371669.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg",
  },
  {
    cat: "ai-services",
    title: "AI Services",
    desc: "Add talent to AI",
    img: "https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/data.718910f.svg",
  },
  {
    cat: "business",
    title: "Business",
    desc: "Grow your company",
    img: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg",
  },
  {
    cat: "data",
    title: "Data",
    desc: "Turn numbers into answers",
    img: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/data.718910f.svg",
  },
  {
    cat: "photography",
    title: "Photography",
    desc: "Capture your moments",
    img: "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/photography.01cf943.svg",
  },
  {
    cat: "lifestyle",
    title: "Lifestyle",
    desc: "Invest in yourself",
    img: "https://images.pexels.com/photos/15032623/pexels-photo-15032623.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    icon: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/lifestyle.745b575.svg",
  },
];

export const categoryTitle = (cat?: string) =>
  categories.find((c) => c.cat === cat)?.title || cat || "All Gigs";
