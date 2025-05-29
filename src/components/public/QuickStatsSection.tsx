import React, { useState, useEffect, useRef } from 'react';
import { useCampusMetricsStore } from '../../store/campusmetricsStore'; // Adjust path based on your file structure

// Define the structure for a stat item based on your API response
// We'll reuse the Metric interface from the store for consistency
interface Metric {
  metric_name: string;
  metric_value: string;
}

// Counter component to animate number counting
interface CounterProps {
  from: number;
  to: number;
  duration: number; // in milliseconds
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({ from, to, duration, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false); // To ensure animation runs only once

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          let start: number | null = null;
          const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            const currentCount = Math.min(to, from + (to - from) * progress);
            setCount(Math.floor(currentCount));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(to); // Ensure final value is exact
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const QuickStatsSection: React.FC = () => {
  // Use the Zustand store to get metrics, loading state, and error
  const { metrics, loading, error, fetchMetrics } = useCampusMetricsStore();

  // Fetch metrics when the component mounts
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]); // Dependency array ensures fetchMetrics is called once on mount

  // Transform the fetched metrics into the StatItem format for the Counter
  // We need to parse the `metric_value` into a number and extract the suffix
  const transformedStats = metrics.map(metric => {
    let targetValue: number;
    let suffix: string | undefined;

    // Handle suffixes like '+', '%', or pure numbers
    const valueStr = metric.metric_value.trim();
    if (valueStr.endsWith('+')) {
      targetValue = parseInt(valueStr.slice(0, -1), 10);
      suffix = '+';
    } else if (valueStr.endsWith('%')) {
      targetValue = parseInt(valueStr.slice(0, -1), 10);
      suffix = '%';
    } else {
      targetValue = parseInt(valueStr, 10);
      suffix = undefined;
    }

    return {
      label: metric.metric_name,
      targetValue: targetValue,
      suffix: suffix,
    };
  });

  if (loading) {
    return (
      <section className="py-16 bg-[#0b3d64] text-white font-inter flex justify-center items-center h-[200px]">
        <p className="text-xl">Loading stats...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-red-800 text-white font-inter flex justify-center items-center h-[200px]">
        <p className="text-xl">Error loading stats: {error}</p>
      </section>
    );
  }

  // Only render if metrics are loaded and available
  if (transformedStats.length === 0 && !loading && !error) {
    return (
      <section className="py-16 bg-[#0b3d64] text-white font-inter flex justify-center items-center h-[200px]">
        <p className="text-xl">No stats available.</p>
      </section>
    );
  }


  return (
    <section className="py-16 bg-[#0b3d64] text-white font-inter"> {/* Dark blue background */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {transformedStats.map((stat, index) => (
            <div key={stat.label} className="text-center"> {/* Using label as key for stability */}
              <p className="text-5xl font-extrabold mb-2">
                <Counter from={0} to={stat.targetValue} duration={2000} suffix={stat.suffix} />
              </p>
              <p className="text-lg font-medium opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStatsSection;