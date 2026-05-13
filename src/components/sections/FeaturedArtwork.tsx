import dnd from "@/assets/card-dnd.jpg";
import furry from "@/assets/card-furry.jpg";
import anime from "@/assets/card-anime.jpg";
import dragon from "@/assets/card-dragon.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cards = [
  { image: dnd, title: "Epic DnD Heroes" },
  { image: furry, title: "Furry Art" },
  { image: anime, title: "Anime Characters" },
  { image: dragon, title: "Fantasy Creatures" },
];

const FeaturedArtwork = () => (
  <section id="artwork" className="section-shell-lg relative">
    <div className="container relative z-10">
      <div className="mb-14 text-center md:mb-16">
        <p className="eyebrow mb-4 text-primary">Portfolio</p>

        <h2 className="section-title mb-4 font-display text-4xl font-bold text-glow md:text-6xl">
          Featured Artwork
        </h2>

        <div className="divider-glow mx-auto w-64" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-14">
        <div className="pointer-events-none absolute inset-x-20 top-1/2 h-32 -translate-y-1/2 rounded-full bg-primary/8 blur-[84px]" />

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          loop={cards.length > 3}
          slidesPerView={1}
          spaceBetween={12}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
          }}
          speed={800}
          navigation={{
            prevEl: ".featured-artwork-prev",
            nextEl: ".featured-artwork-next",
          }}
          pagination={{
            clickable: true,
            el: ".featured-artwork-pagination",
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
              centeredSlides: false,
            },
          }}
          className="featured-artwork-swiper"
        >
          {cards.map((card) => (
            <SwiperSlide
              key={card.title}
              className="featured-artwork-slide"
            >
              <article
                className="interactive-surface group overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] shadow-[0_22px_60px_-28px_rgba(15,23,42,0.95)] backdrop-blur-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,24,0.08)_0%,rgba(6,10,24,0.28)_45%,rgba(3,6,18,0.88)_100%)]" />

                  <div className="absolute inset-x-6 bottom-6 text-center md:inset-x-8 md:bottom-8">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.42em] text-white/68 md:text-[11px]">
                      Featured
                    </p>

                    <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.35)] md:text-[1.7rem]">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          aria-label="Previous artwork"
          className="featured-artwork-prev interactive-surface absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/85 backdrop-blur-md hover:scale-[1.03] hover:border-white/35 hover:bg-black/45 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Next artwork"
          className="featured-artwork-next interactive-surface absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/85 backdrop-blur-md hover:scale-[1.03] hover:border-white/35 hover:bg-black/45 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="featured-artwork-pagination mt-10 flex items-center justify-center gap-2" />
      </div>
    </div>

    <style>{`
      #artwork .featured-artwork-swiper {
        overflow: hidden;
        padding-block: 12px;
      }

      #artwork .swiper-wrapper {
        align-items: stretch;
        transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      }

      #artwork .featured-artwork-slide {
        height: auto;
        opacity: 1;
        transform: none;
        transition:
          transform 800ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 800ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      #artwork .featured-artwork-slide > * {
        height: 100%;
      }

      #artwork .swiper-slide-active,
      #artwork .swiper-slide-prev,
      #artwork .swiper-slide-next {
        opacity: 1;
        transform: none;
      }

      @media (max-width: 767px) {
        #artwork .featured-artwork-slide {
          opacity: 1;
          transform: none;
        }
      }

      #artwork .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        margin: 0 !important;
        background: rgba(255, 255, 255, 0.36);
        opacity: 1;
        transition: all 260ms ease;
      }

      #artwork .swiper-pagination-bullet-active {
        width: 30px;
        border-radius: 999px;
        background: hsl(var(--primary));
        box-shadow: 0 0 24px hsl(var(--primary) / 0.55);
      }
    `}</style>
  </section>
);

export default FeaturedArtwork;
