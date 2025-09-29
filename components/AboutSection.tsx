
import React from 'react';

export const AboutSection: React.FC = () => {
    return (
        <section id="sobre" className="py-20 bg-brand-ivory-50">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                         <span className="inline-block bg-brand-green-300 text-brand-green-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
                            <i className="fas fa-heart mr-2"></i>Nossa História
                        </span>
                        <h2 className="text-4xl font-bold text-text-on-light mb-6">Tradição e Sabor desde 1909</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Na Pizzaria Santa Sensação, cada pizza é uma obra de arte preparada com ingredientes selecionados e o carinho de quem faz com amor. Nossa massa artesanal é fermentada por 24 horas, nosso molho tem receita secreta da família, e cada pizza é assada em forno a lenha tradicional para garantir aquele sabor único e inconfundível.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3"><i className="fas fa-check-circle text-accent"></i><span>Massa artesanal fermentada por 24h</span></div>
                            <div className="flex items-center gap-3"><i className="fas fa-check-circle text-accent"></i><span>Ingredientes frescos e selecionados</span></div>
                            <div className="flex items-center gap-3"><i className="fas fa-check-circle text-accent"></i><span>Forno a lenha tradicional</span></div>
                            <div className="flex items-center gap-3"><i className="fas fa-check-circle text-accent"></i><span>Atendimento familiar e acolhedor</span></div>
                        </div>
                    </div>
                    <div className="relative">
                        <img src="https://picsum.photos/seed/pizzaria-about/600/450" alt="Interior da Pizzaria Santa Sensação" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
                        <div className="absolute -bottom-6 -right-6 grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl shadow-lg border border-gray-200 w-4/5">
                            <div className="text-center">
                                <p className="font-bold text-2xl text-accent">1.5K+</p>
                                <p className="text-xs text-gray-500">Seguidores</p>
                            </div>
                             <div className="text-center">
                                <p className="font-bold text-2xl text-accent">100+</p>
                                <p className="text-xs text-gray-500">Pizzas/Semana</p>
                            </div>
                             <div className="text-center">
                                <p className="font-bold text-2xl text-accent">🏅</p>
                                <p className="text-xs text-gray-500">Nº 1 do ES</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
