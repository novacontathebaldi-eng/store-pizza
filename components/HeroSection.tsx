
import React from 'react';

export const HeroSection: React.FC = () => {
    const scrollToCardapio = () => {
        const cardapioSection = document.getElementById('cardapio');
        if (cardapioSection) {
            const headerOffset = 80;
            const elementPosition = cardapioSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
        }
    };

    return (
        <section id="inicio" className="bg-brand-green-700 text-text-on-dark min-h-[calc(100vh-80px)] flex items-center justify-center pb-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://www.allrecipes.com/thmb/v1_2tNBh3v8G_6a_6Y1y4s42f2E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20171-quick-and-easy-pizza-crust-Vilma-Ng-4x3-f3d3bfe73e3c4a6c8882b85a3b756543.jpg')"}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-700 via-brand-green-700/80 to-transparent"></div>
            
            <div className="container mx-auto text-center z-10">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                    <p className="font-semibold text-sm flex items-center gap-2"><i className="fas fa-award text-brand-gold-600"></i> A pizza nº 1 do ES</p>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                    Pizzaria <span className="text-brand-gold-600">Santa Sensação</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-brand-ivory-50/90 mb-8 max-w-2xl mx-auto">
                    A pizza premiada do Espírito Santo, com ingredientes frescos, massa artesanal e a assinatura de um mestre.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={scrollToCardapio} className="bg-brand-gold-600 text-text-on-dark font-bold py-3 px-8 rounded-xl text-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
                        <i className="fas fa-pizza-slice mr-2"></i> Ver Cardápio e Pedir
                    </button>
                </div>
            </div>
        </section>
    );
};