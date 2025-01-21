import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/easy_to_use.svg').default,
    description: (
      <>
        The VMan tool combines simplicity and functionality, integrating key features into a user-friendly platform. Standardized dashboards and seamless automation streamline workflows, saving time and effort.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/focus.svg').default,
    description: (
      <>
        Prioritize impactful outcomes with VMan's focus on data accuracy and visualization. Adhering to global standards, it eliminates manual redundancies for smarter decision-making.
      </>
    ),
  },
  {
    title: 'Built with Commitment',
    Svg: require('@site/static/img/commitment.svg').default,
    description: (
      <>
        Crafted with precision, VMan reflects a dedication to excellence. With robust APIs, error-checking, and adherence to global best practices, it ensures reliability and quality.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
