export default function SkeletonJobCard() {
  return (
    <div className="glass-card" style={{ padding: '24px', opacity: 0.7, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: '22px', width: '65%', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ height: '16px', width: '40%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
        </div>
        <div style={{ height: '28px', width: '70px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px' }} />
      </div>

      <div style={{ height: '14px', width: '90%', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '14px', width: '75%', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '4px', marginBottom: '16px' }} />

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ height: '22px', width: '60px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }} />
        <div style={{ height: '22px', width: '80px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }} />
        <div style={{ height: '22px', width: '50px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: '18px', width: '30%', background: 'rgba(255, 255, 255, 0.09)', borderRadius: '4px' }} />
        <div style={{ height: '34px', width: '90px', background: 'rgba(99, 102, 241, 0.3)', borderRadius: '10px' }} />
      </div>
    </div>
  );
}
