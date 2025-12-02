import React, { useState } from 'react';

import Tab1 from '/productImg/one.webp';
import Tab2 from '/productImg/four.webp';
import Tab3 from '/productImg/three.webp';
import Tab4 from '/productImg/two.webp';
import Tab6 from '/productImg/DSC_9179.jpg';
import Tab5 from '/productImg/eighth.webp';

import d1 from '/design/Design.webp';
import d2 from '/bseat.webp';
import d3 from '/battery.png';
import p1 from '/p1.webp';
import p2 from '/p2.webp';
import p4 from '/p4.webp';

const ProductFeatures = () => {
  const [activeTab, setActiveTab] = useState('Design');

  const designImages = [d1, p1, Tab4, Tab2, Tab5];
  const performanceImages = [p2, Tab3, p4, Tab6, d1];

  const mobileRender = () => {
    let imgs = [];
    if (activeTab === 'Design') imgs = designImages;
    if (activeTab === 'Performance') imgs = performanceImages;

    return (
      <div
        className="grid grid-cols-2 gap-2 md:hidden"
        aria-live="polite"
      >
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-lg ${
              i === 0 ? 'col-span-2' : ''
            }`}
          >
            <img
              src={src}
              alt={`${activeTab} feature image ${i + 1}`}
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  };

  const desktopRender = () => {
    switch (activeTab) {
      case 'Design':
        return (
          <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-4 h-[600px]">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={d1}
                alt="Iconic scooter design and headlamp"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-start bg-gradient-to-b from-black/50 via-transparent to-transparent">
                <h3 className="text-white text-2xl font-bold">
                  Iconic Headle
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Like the moon, but better.
                </p>
              </div>
            </div>

            <div className="row-span-2 relative rounded-lg overflow-hidden">
              <img
                src={p1}
                alt="Digital display of electric scooter"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={d3}
                alt="High capacity scooter battery"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-start bg-gradient-to-b from-black/50 via-transparent to-transparent">
                <h3 className="text-white text-2xl font-bold">Battery</h3>
                <p className="text-white/80 text-sm mt-1 max-w-xs">
                  Long-lasting power. Efficient, reliable and built for
                  extended adventures.
                </p>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={Tab2}
                alt="High torque electric motor"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-start bg-gradient-to-b from-black/50 via-transparent to-transparent">
                <h3 className="text-white text-2xl font-bold">Motor</h3>
                <p className="text-white/80 text-sm mt-1 max-w-xs">
                  Silent power, maximum torque. Thrilling performance
                  in every ride.
                </p>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={Tab5}
                alt="Durable tyres with superior grip"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-start bg-gradient-to-b from-black/50 via-transparent to-transparent">
                <h3 className="text-white text-2xl font-bold">Tyre</h3>
                <p className="text-white/80 text-sm mt-1 max-w-xs">
                  Superior grip for every terrain. Durable, reliable,
                  and built for smooth rides.
                </p>
              </div>
            </div>
          </div>
        );

      case 'Performance':
        return (
          <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-4 h-[600px]">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={p2}
                alt="Electric scooter acceleration and performance"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="row-span-2 relative rounded-lg overflow-hidden">
              <img
                src={Tab3}
                alt="Advanced performance display"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={d2}
                alt="Comfortable scooter back seat"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={Tab6}
                alt="Powerful electric drivetrain"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={p4}
                alt="Performance focused scooter components"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      className="relative py-12 sm:py-16 px-4"
      aria-labelledby="product-features-heading"
      style={{
        background:
          'linear-gradient(104.73deg, #579BD9 0%, #001A2C 60.41%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-10">
          <div
            className="flex overflow-x-auto gap-2 scrollbar-none border-b border-white/30 px-2"
            role="tablist"
            aria-label="Product features tabs"
          >
            {['Design', 'Performance'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-label={`${tab} features`}
                className={`px-5 md:px-6 py-2 md:py-3 text-white font-medium relative whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'opacity-100'
                    : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-10">
          <h2
            id="product-features-heading"
            className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4"
          >
            Smart Style. Practical Design. Unmatched Build.
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-sm sm:text-base md:text-lg">
            We are the best electric two wheeler manufacturer in India who
            focus on performance and style. Check the reasons why we are
            the best manufacturer for your two-wheeler needs!
          </p>
        </div>

        {mobileRender()}
        {desktopRender()}
      </div>
    </section>
  );
};

export default ProductFeatures;
