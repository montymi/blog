import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import Meta from '@/components/Meta';
import { useTheme } from '@mui/material/styles';

const MosaicContainer = styled('div')({
  display: 'grid',
  borderRadius: '15px',
  padding: '3em',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
});

const Tile = styled('div')<{ flipped: boolean }>(({ flipped, theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '100%', // Makes the tiles square
  cursor: 'pointer',
  perspective: '1000px',
  zIndex: '1',
  transition: 'all 0.3s ease',
  '&:hover': {
    scale: '1.5',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    zIndex: '2',
  },
  '& > div': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.5s ease',
  },
  '& > .front, & > .back': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: '1em',
    display: 'flex',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  '& > .front': {
    backgroundColor: theme.palette.background.paper,
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    alignItems: 'center',
    textAlign: 'center',
  },
  '& > .back': {
    backgroundColor: theme.palette.primary.main,
    overflowY: 'auto',
    alignItems: 'flex-start',
    color: theme.palette.primary.contrastText,
    transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
    textAlign: 'left',
  },
}));

type Activity = {
  title: string;
  description: string;
};

const Activity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const theme = useTheme();

  useEffect(() => {
    fetch('./activities.json')
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((error) => console.error('Error loading activities:', error));
  }, []);

  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    Array(activities.length).fill(false), // Initialize all tiles as unflipped
  );

  const handleTileClick = (index: number) => {
    setFlippedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index]; // Toggle the flipped state
      return newStates;
    });
  };

  return (
    <>
      <Meta title="Activity" />
      <MosaicContainer>
        {activities.map((activity, index) => (
          <Tile
            key={index}
            flipped={flippedStates[index]}
            onClick={() => handleTileClick(index)}
            theme={theme}
          >
            <div className="front">
              <Typography variant="h6">{activity.title}</Typography>
            </div>
            <div className="back">
              <Typography variant="body2">{activity.description}</Typography>
            </div>
          </Tile>
        ))}
      </MosaicContainer>
    </>
  );
};

export default Activity;
