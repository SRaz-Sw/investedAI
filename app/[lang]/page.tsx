'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	ArrowRight,
	BarChart2,
	Calculator,
	PiggyBank,
	Shield,
	TrendingUp,
	Zap,
} from 'lucide-react';
import {
	Language,
	useTranslationStore,
	landingTranslations,
} from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import { HeroSection } from '@/components/ui/hero-section';

// Smooth scroll function
const scrollToSection = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}
};

// Feature card component with animation
const FeatureCard = ({
	icon,
	title,
	description,
	link,
	index = 0,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	link: string;
	index?: number;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="group h-full border border-border/40 bg-background/60 backdrop-blur-sm transition-all hover:border-emerald-500/20 hover:shadow-md dark:border-border/20 dark:bg-background/40 dark:hover:border-emerald-500/20">
				<CardHeader className="text-center md:text-left">
					<div className="mb-2 rounded-full bg-emerald-500/10 p-2 w-10 h-10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto md:mx-0">
						{icon}
					</div>
					<CardTitle className="text-xl">{title}</CardTitle>
				</CardHeader>
				<CardContent className="text-center md:text-left">
					<p className="text-muted-foreground">{description}</p>
				</CardContent>
				<CardFooter className="justify-center md:justify-start">
					<Button
						variant="ghost"
						size="sm"
						className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
						asChild
					>
						<a href={link}>
							Learn more{' '}
							<ArrowRight className="ml-1 h-4 w-4" />
						</a>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

// Testimonial component with animation
const Testimonial = ({
	content,
	author,
	role,
	avatarSrc,
	index = 0,
}: {
	content: string;
	author: string;
	role: string;
	avatarSrc?: string;
	index?: number;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="h-full border border-border/40 bg-background/60 backdrop-blur-sm dark:border-border/20 dark:bg-background/40">
				<CardContent className="pt-6 flex flex-col h-full">
					<p className="mb-4 italic text-muted-foreground flex-grow">
						"{content}"
					</p>
					<div className="flex items-center gap-3 mt-auto">
						<Avatar>
							<AvatarImage src={avatarSrc} />
							<AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
								{author[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium">{author}</p>
							<p className="text-sm text-muted-foreground">
								{role}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Calculator preview component with animation
const CalculatorPreview = ({
	title,
	description,
	icon,
	benefits,
	link,
	buttonText,
	index = 0,
	lang,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	benefits: string[];
	link: string;
	buttonText: string;
	index?: number;
	lang: Language;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			className="flex flex-col md:flex-row gap-6 mx-auto md:items-start items-center text-center md:text-left"
		>
			<div className="flex-shrink-0 rounded-full bg-emerald-500/10 p-4 w-16 h-16 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
				{icon}
			</div>
			<div className="space-y-4 w-full">
				<div>
					<h3 className="text-xl font-semibold">{title}</h3>
					<p className="text-muted-foreground mt-1">
						{description}
					</p>
				</div>
				<ul className="space-y-2">
					{benefits.map((benefit, index) => (
						<li
							key={index}
							className="flex items-start gap-2 md:justify-start justify-center"
						>
							<div className="rounded-full bg-emerald-500/10 p-1 mt-0.5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-3.5 w-3.5 text-emerald-500"
								>
									<path
										fillRule="evenodd"
										d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<span className="text-sm">{benefit}</span>
						</li>
					))}
				</ul>
				<div className="flex justify-center md:justify-start">
					<Button
						className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white"
						asChild
					>
						<a href={`/${lang}${link}`}>{buttonText}</a>
					</Button>
				</div>
			</div>
		</motion.div>
	);
};

// Section header component with animation
const SectionHeader = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="flex flex-col items-center justify-center space-y-4 text-center"
		>
			<div className="space-y-2">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
					{title}
				</h2>
				<p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
					{description}
				</p>
			</div>
		</motion.div>
	);
};

export default function Home({
	params: { lang },
}: {
	params: { lang: Language };
}) {
	const { setLanguage } = useTranslationStore();
	const t = landingTranslations[lang];

	useEffect(() => {
		setLanguage(lang);
	}, [lang, setLanguage]);

	return (
		<div className="relative w-full overflow-x-hidden bg-zinc-200 dark:bg-zinc-900">
			{/* Hero Section */}
			<HeroSection
				subtitle={{
					regular: t.heroSubtitleRegular,
					gradient: t.heroSubtitleGradient,
				}}
				description={t.heroDescription}
				ctaHref="#calculators"
				ctaOnClick={() => scrollToSection('calculators')}
			/>

			{/* Value Proposition Section */}
			<section
				className="py-16 md:py-24 w-full bg-zinc-200 dark:bg-zinc-950"
				id="why-invested-ai"
			>
				<div className="container px-4 md:px-6 mx-auto">
					<SectionHeader
						title={t.whyChooseTitle}
						description={t.whyChooseDescription}
					/>
					<div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-12 mx-auto">
						<FeatureCard
							icon={<Zap className="h-5 w-5" />}
							title={t.aiPoweredTitle}
							description={t.aiPoweredDescription}
							link="#calculators"
							index={0}
						/>
						<FeatureCard
							icon={<TrendingUp className="h-5 w-5" />}
							title={t.longTermGrowthTitle}
							description={t.longTermGrowthDescription}
							link="#calculators"
							index={1}
						/>
						<FeatureCard
							icon={<Shield className="h-5 w-5" />}
							title={t.financialSecurityTitle}
							description={t.financialSecurityDescription}
							link="#calculators"
							index={2}
						/>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				className="py-16 md:py-24 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 w-full"
				id="how-it-works"
			>
				<div className="container px-4 md:px-6 mx-auto">
					<SectionHeader
						title={t.howItWorksTitle}
						description={t.howItWorksDescription}
					/>
					<div className="grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 mt-12 mx-auto">
						{[
							{
								step: 1,
								title: t.step1Title,
								description: t.step1Description,
							},
							{
								step: 2,
								title: t.step2Title,
								description: t.step2Description,
							},
							{
								step: 3,
								title: t.step3Title,
								description: t.step3Description,
							},
						].map((item, index) => (
							<motion.div
								key={item.step}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
								className="flex flex-col items-center text-center"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white">
									{item.step}
								</div>
								<h3 className="text-xl font-semibold">
									{item.title}
								</h3>
								<p className="mt-2 text-muted-foreground">
									{item.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Calculators Section */}
			<section
				className="py-16 md:py-24 w-full bg-zinc-200 dark:bg-zinc-950"
				id="calculators"
			>
				<div className="container px-4 md:px-6 mx-auto">
					<SectionHeader
						title={t.calculatorsTitle}
						description={t.calculatorsDescription}
					/>
					<div className="mt-12 space-y-12 max-w-5xl mx-auto">
						<CalculatorPreview
							title={t.compoundTitle}
							description={t.compoundDescription}
							icon={<TrendingUp className="h-6 w-6" />}
							benefits={[
								t.compoundBenefit1,
								t.compoundBenefit2,
								t.compoundBenefit3,
							]}
							link="/compound"
							buttonText={t.tryCalculator}
							index={2}
							lang={lang}
						/>
						<Separator className="bg-zinc-200 dark:bg-zinc-700" />
						<CalculatorPreview
							title={t.pensionTitle}
							description={t.pensionDescription}
							icon={<PiggyBank className="h-6 w-6" />}
							benefits={[
								t.pensionBenefit1,
								t.pensionBenefit2,
								t.pensionBenefit3,
							]}
							link="/pension"
							buttonText={t.tryCalculator}
							index={1}
							lang={lang}
						/>
						<Separator className="bg-zinc-200 dark:bg-zinc-700" />
						<CalculatorPreview
							title={t.portfolioLoanTitle}
							description={t.portfolioLoanDescription}
							icon={<Calculator className="h-6 w-6" />}
							benefits={[
								t.portfolioBenefit1,
								t.portfolioBenefit2,
								t.portfolioBenefit3,
							]}
							link="/loan-vs-sell"
							buttonText={t.tryCalculator}
							index={0}
							lang={lang}
						/>
						<Separator className="bg-zinc-200 dark:bg-zinc-700" />
						<CalculatorPreview
							title={t.realEstateTitle}
							description={t.realEstateDescription}
							icon={<BarChart2 className="h-6 w-6" />}
							benefits={[
								t.realEstateBenefit1,
								t.realEstateBenefit2,
								t.realEstateBenefit3,
							]}
							link="/realestate2"
							buttonText={t.tryCalculator}
							index={3}
							lang={lang}
						/>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50/50 via-zinc-100 to-zinc-200 dark:from-emerald-950/20 dark:via-zinc-800 dark:to-zinc-900 w-full">
				<div className="container px-4 md:px-6 mx-auto">
					<SectionHeader
						title={t.testimonialsTitle}
						description={t.testimonialsDescription}
					/>
					<div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 mt-12 mx-auto">
						<Testimonial
							content={t.testimonial1Content}
							author={t.testimonial1Author}
							role={t.testimonial1Role}
							index={0}
						/>
						<Testimonial
							content={t.testimonial2Content}
							author={t.testimonial2Author}
							role={t.testimonial2Role}
							index={1}
						/>
						<Testimonial
							content={t.testimonial3Content}
							author={t.testimonial3Author}
							role={t.testimonial3Role}
							index={2}
						/>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-24 w-full bg-zinc-200 dark:bg-zinc-950">
				<div className="container px-4 md:px-6 mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-emerald-50/95 via-emerald-50/90 to-zinc-50/95 dark:from-emerald-950/30 dark:via-emerald-900/30 dark:to-zinc-900/30 backdrop-blur-md shadow-md border border-emerald-100/50 dark:border-emerald-900/50"
					>
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent">
								{t.ctaTitle}
							</h2>
							<p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
								{t.ctaDescription}
							</p>
						</div>
						<div className="mt-6">
							<Button
								size="lg"
								className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white"
								onClick={() =>
									scrollToSection('calculators')
								}
							>
								{t.tryOurCalculators}
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
