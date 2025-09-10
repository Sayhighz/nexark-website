"use client"

import clsx from "clsx"
import ScrollObserver from '../ScrollObserver'
import YouTubeEmbed from '../YouTubeEmbed'
import StarBackground from './StarBackground'

// Import images
import img1 from '../../assets/photos/819947.jpg'
import img2 from '../../assets/photos/819949.jpg'
import img3 from '../../assets/photos/819952.jpg'
import img4 from '../../assets/photos/1247500.jpg'
import img5 from '../../assets/photos/1252283.jpg'

export default function PVPSection() {
  const items = [
    {
      title: "Epic Combat System",
      content: "Experience intense player vs player battles with our advanced combat mechanics. Master different weapons, tactics, and strategies to dominate the battlefield.",
      image: img1
    },
    {
      title: "Ranked Matches",
      content: "Climb the competitive ladder in our ranked PvP system. Earn rewards, unlock exclusive items, and prove your skills against players from around the world.",
      image: img2
    },
    {
      title: "Team-Based Warfare",
      content: "Form alliances and engage in large-scale team battles. Coordinate with your squad to capture objectives, defend territories, and achieve victory.",
      image: img3
    },
    {
      title: "Customizable Loadouts",
      content: "Choose from hundreds of weapons, armor sets, and abilities. Create the perfect build for your playstyle and adapt to any situation.",
      image: img4
    },
    {
      title: "Real-Time Strategy",
      content: "Make split-second decisions that can turn the tide of battle. Use terrain, timing, and teamwork to outmaneuver your opponents.",
      image: img5
    },
    {
      title: "Tournament Events",
      content: "Participate in special PvP tournaments with massive prizes. Compete against the best players and earn legendary status in the community.",
      image: img1
    },
  ]

  return (
    <div className="min-h-screen w-screen px-8 py-12 md:px-0 relative">
      <StarBackground />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollObserver className="relative grid grid-cols-2 gap-32">
          {(isHidden) => (
            <>
              <ScrollObserver.TriggerGroup className="py-[50vh]">
                {items.map((item, index) => (
                  <ScrollObserver.Trigger id={`features-${index}`} key={index} className="relative scroll-mt-[50vh]">
                    {(isActive) => (
                      <div
                        className={clsx(
                          isActive ? "text-white" : "text-white/10 hover:text-white/30",
                          "relative -mx-8 -mb-4 rounded-2xl p-8 transition duration-300 hover:bg-white/10",
                        )}>
                        <div className="font-epilogue text-4xl font-bold">{item.title}</div>

                        <div className="mt-4 text-lg">{item.content}</div>

                        <a href={`#features-${index}`} className="absolute inset-0"></a>
                      </div>
                    )}
                  </ScrollObserver.Trigger>
                ))}
              </ScrollObserver.TriggerGroup>

              <div className="sticky top-0 h-[100vh]">

                <ScrollObserver.ReactorGroup className="flex items-center justify-center">
                  {items.map((item, index) => (
                    <ScrollObserver.Reactor key={index} index={index} className="absolute inset-0 flex items-center justify-center">
                      {(isActive) => {
                        const glowColors = [
                          "shadow-[0_0_30px_rgba(59,130,246,0.8)]", // blue
                          "shadow-[0_0_30px_rgba(147,51,234,0.8)]", // purple
                          "shadow-[0_0_30px_rgba(34,197,94,0.8)]",  // green
                          "shadow-[0_0_30px_rgba(251,191,36,0.8)]", // yellow
                          "shadow-[0_0_30px_rgba(239,68,68,0.8)]",  // red
                          "shadow-[0_0_30px_rgba(6,182,212,0.8)]"   // cyan
                        ];

                        return (
                          <div className={clsx(
                            "transition-all duration-500 rounded-3xl overflow-hidden",
                            {
                              "opacity-0": !isActive,
                              "opacity-100": isActive,
                              [glowColors[index % glowColors.length]]: isActive,
                            }
                          )}>
                            <img
                              src={item.image}
                              alt={`${item.title} illustration`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        );
                      }}
                    </ScrollObserver.Reactor>
                  ))}
                </ScrollObserver.ReactorGroup>
              </div>
            </>
          )}
        </ScrollObserver>
      </div>
    </div>
  )
}