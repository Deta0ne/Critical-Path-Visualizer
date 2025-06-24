import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HelpPage() {
    const { t } = useTranslation();

    const categories = ['gettingStarted', 'activities', 'analysis', 'reports'];

    const faqItems = ['whatIsCPM', 'whatIsPERT', 'howToStart', 'canIExport'];

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

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            {/* Header Section */}
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-4"
                >
                    {t('pages.help.title')}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg"
                >
                    {t('pages.help.description')}
                </motion.p>
            </div>

            {/* Categories Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
                {categories.map((category) => (
                    <motion.div key={category} variants={itemVariants}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{t(`pages.help.categories.${category}.title`)}</CardTitle>
                                <CardDescription>{t(`pages.help.categories.${category}.description`)}</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-bold mb-6">{t('pages.help.faq')}</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item) => (
                        <AccordionItem key={item} value={item}>
                            <AccordionTrigger className="text-left">
                                {t(`pages.help.faqItems.${item}.question`)}
                            </AccordionTrigger>
                            <AccordionContent>{t(`pages.help.faqItems.${item}.answer`)}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Contact Section */}
            <section className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('pages.help.contact.title')}</CardTitle>
                        <CardDescription>{t('pages.help.contact.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input placeholder={t('pages.help.contact.email')} type="email" />
                            <Textarea placeholder={t('pages.help.contact.message')} className="min-h-[100px]" />
                            <Button className="w-full sm:w-auto">
                                {t('pages.help.contact.send')}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
