import PohoLogo from './poho-logo';
import PohoText from './poho-text';

const PohoLogoWithText = () => {
  return (
    <div className="inline-flex items-center justify-center gap-3">
      <PohoLogo />
      <PohoText />
    </div>
  );
}

export default PohoLogoWithText
