import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, Network, Timer, GitGraph, Save, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const features = [
        {
            icon: <Activity className="w-12 h-12 text-primary" />,
            title: t('pages.home.features.pertAnalysis.title'),
            description: t('pages.home.features.pertAnalysis.description'),
        },
        {
            icon: <Network className="w-12 h-12 text-primary" />,
            title: t('pages.home.features.networkDiagram.title'),
            description: t('pages.home.features.networkDiagram.description'),
        },
        {
            icon: <GitGraph className="w-12 h-12 text-primary" />,
            title: t('pages.home.features.criticalPath.title'),
            description: t('pages.home.features.criticalPath.description'),
        },
        {
            icon: <Timer className="w-12 h-12 text-primary" />,
            title: t('pages.home.features.ganttChart.title'),
            description: t('pages.home.features.ganttChart.description'),
        },
        {
            icon: <Save className="w-12 h-12 text-primary" />,
            title: t('pages.home.features.projectSaving.title'),
            description: t('pages.home.features.projectSaving.description'),
        },
        {
            icon: <BarChart3 className="w-12 h-12 text-primary" />,
            title: t('pages.home.features.statistics.title'),
            description: t('pages.home.features.statistics.description'),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    const steps = [
        {
            title: t('pages.home.howItWorks.steps.step1.title'),
            description: t('pages.home.howItWorks.steps.step1.description'),
        },
        {
            title: t('pages.home.howItWorks.steps.step2.title'),
            description: t('pages.home.howItWorks.steps.step2.description'),
        },
        {
            title: t('pages.home.howItWorks.steps.step3.title'),
            description: t('pages.home.howItWorks.steps.step3.description'),
        },
        {
            title: t('pages.home.howItWorks.steps.step4.title'),
            description: t('pages.home.howItWorks.steps.step4.description'),
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 text-center relative overflow-hidden">
                {/* Ana gradient katmanı */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 -z-10" />

                {/* Animasyonlu gradient blur */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -inset-[10px] opacity-50">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
                        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-secondary/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
                    </div>
                </div>

                {/* Nokta deseni katmanı */}
                <div className="absolute inset-0 [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30 -z-10" />

                {/* Izgara deseni katmanı */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 [background:linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:80px_80px] opacity-[0.15] -z-10" />
                    <div className="absolute inset-0 [background:linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.1] -z-10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto px-4"
                >
                    <div className="relative">
                        {/* Blur efektleri */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -top-20 left-1/3 -translate-x-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />

                        {/* Başlık */}
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent relative">
                            {t('pages.home.heroTitle')}
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
                        {t('pages.home.heroDescription')}
                    </p>
                    <div className="flex gap-4 justify-center relative z-10">
                        <Button
                            size="lg"
                            onClick={() => navigate('/dashboard')}
                            className="text-lg group relative overflow-hidden"
                        >
                            <span className="relative z-10">{t('pages.home.getStarted')}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-20 transition-opacity" />
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/projects')}
                            className="text-lg group relative overflow-hidden"
                        >
                            <span className="relative z-10">{t('pages.home.myProjects')}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        {t('pages.home.features.title')}
                    </motion.h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="p-6 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-3xl font-bold text-center mb-16"
                    >
                        {t('pages.home.howItWorks.title')}
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/4 right-0 w-full h-0.5 bg-gradient-to-r from-primary/20 to-primary/20 transform translate-x-1/2" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="container mx-auto px-4 text-center"
                >
                    <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                        <h2 className="text-3xl font-bold mb-6">{t('pages.home.cta.title')}</h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t('pages.home.cta.description')}
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/dashboard')}
                            className="text-lg group relative overflow-hidden"
                        >
                            <span className="relative z-10">{t('pages.home.cta.button')}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-20 transition-opacity" />
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
