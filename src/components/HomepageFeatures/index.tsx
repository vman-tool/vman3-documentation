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
    title: 'Configurable',
    Svg: require('@site/static/img/configurable.svg').default,
    description: (
      <>
        The VMan tool allows countries to tailor dashboards, access controls, and data validation to their needs while maintaining global standards. Its flexibility ensures seamless adaptation to diverse workflows without compromising data integrity.
      </>
    ),
  },
  {
    title: 'Scalable',
    Svg: require('@site/static/img/scalable.svg').default,
    description: (
      <>
          Designed to handle growing data needs across regions without compromising performance. It adapts effortlessly to different levels of implementation, ensuring efficiency from local to national use.
      </>
    ),
  },
  {
    title: 'Interoperable',
    Svg: require('@site/static/img/interopeability.svg').default,
    description: (
      <>
        Enabling seamless integration with other systems through APIs for automated data exchange. It ensures smooth communication between platforms, enhancing data consistency and accessibility. Streamlining workflows and improving overall system efficiency
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
