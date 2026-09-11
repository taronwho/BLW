import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import QRCode from 'qrcode';

interface Props {
  value: string;
  label: string;
  size?: number;
}

/**
 * QR kód pro spárování druhého telefonu. Generuje se v prohlížeči, nikam se
 * neposílá — párovací kód nemá opouštět zařízení jinak než ukázáním.
 */
export function QrCode({ value, label, size = 176 }: Props): ReactNode {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: '#16211D', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (failed) {
    return <p className="text-xs text-muted">QR kód se nepodařilo vykreslit, přepiš kód ručně.</p>;
  }
  if (dataUrl === null) {
    return <div style={{ width: size, height: size }} aria-hidden="true" className="rounded-lg bg-paper" />;
  }
  return (
    <img
      src={dataUrl}
      alt={label}
      width={size}
      height={size}
      className="rounded-lg"
      data-testid="qr-kod"
    />
  );
}
