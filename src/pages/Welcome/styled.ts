import { styled } from '@mui/material/styles';

const HERO_SIZE = 220;

// Sized container the disc and its fanned-out petals both anchor to —
// HeroFrame fills it exactly, petals position themselves relative to its
// center via top/left 50%.
const HeroWrap = styled('div')({
  position: 'relative',
  width: HERO_SIZE,
  height: HERO_SIZE,
});

const HeroFrame = styled('button')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: '50%',
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 4,
  },
}));

const Section = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const SocialsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

export { HeroWrap, HeroFrame, Section, SocialsRow };
