import { useState } from 'react';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import ScreenShell from '@/components/ScreenShell';
import { email, linkedin, repository, spotify } from '@/config';
import useHistory from '@/hooks/useHistory';
import useNotifications from '@/store/notifications';

import DiscMenu from './DiscMenu';
import LatestCommit from './LatestCommit';
import { Section, SocialsRow } from './styled';
import { getRandomJoke } from './utils';

function Welcome() {
  const [, notificationsActions] = useNotifications();
  const { events, loading } = useHistory();
  const [selectedYear, setSelectedYear] = useState<number | ''>('');

  const selectedEvent = events.find((event) => event.year === selectedYear) ?? events[0];

  function showJoke() {
    notificationsActions.push({
      options: { variant: 'customNotification' },
      message: getRandomJoke(),
    });
  }

  return (
    <ScreenShell showHome={false} showMenu={false}>
      <Meta title="Welcome" />

      <Typography
        variant="h1"
        onClick={showJoke}
        sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, cursor: 'pointer', textAlign: 'center' }}
      >
        Michael Montanaro
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
        Making products easier to build, adopt, and explain.
      </Typography>

      <Section>
        {loading ? (
          <CircularProgress size={28} />
        ) : events.length > 0 ? (
          <>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontFamily: '"IBM Plex Mono", monospace',
                color: 'text.secondary',
              }}
            >
              <CalendarMonthOutlinedIcon fontSize="small" />
              On this date,
              <Autocomplete
                disableClearable
                size="small"
                options={events.map((event) => event.year)}
                getOptionLabel={(year) => String(year)}
                value={selectedYear || events[0].year}
                onChange={(_event, newValue) => setSelectedYear(newValue)}
                sx={{ width: 96, display: 'inline-block' }}
                ListboxProps={{ className: 'year-listbox', style: { maxHeight: 224 } }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    InputProps={{ ...params.InputProps, disableUnderline: true }}
                    sx={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      '& .MuiInput-input': { fontFamily: 'inherit', color: 'primary.main' },
                    }}
                  />
                )}
              />
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 560 }}>{selectedEvent?.content}</Typography>
          </>
        ) : (
          <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
            No events found for today in history. Have a great day!
          </Typography>
        )}
      </Section>

      <Section>
        <DiscMenu />
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
          Click to explore
        </Typography>
      </Section>

      <Section sx={{ alignItems: 'flex-start', textAlign: 'left', maxWidth: 640 }}>
        <Typography sx={{ mb: 2 }}>
          Computer engineer, with some teaching along the way and, before that, Division I sports. I
          work across software engineering, enterprise deployments, developer experience, and
          technical content — building and deploying software internally and with customers, then
          writing the docs, building the tooling, and running the training so the team can move
          without me.
        </Typography>
        <Typography>
          Working across engineering, customers, product, and marketing means problems found with
          customers often shape the product. When an implementation works, it can become a tool, a
          demo, a guide, or a story, shared in webinars, conferences, and fireside conversations.
          The product gets better, and so does the way people understand, share, and use it.
        </Typography>
      </Section>

      <Section>
        <SocialsRow>
          <Tooltip title="GitHub">
            <IconButton
              component="a"
              href={repository}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="LinkedIn">
            <IconButton
              component="a"
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Spotify">
            <IconButton
              component="a"
              href={spotify}
              target="_blank"
              rel="noreferrer"
              aria-label="Spotify"
            >
              <MusicNoteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Email">
            <IconButton component="a" href={`mailto:${email}`} aria-label="Email">
              <MailOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </SocialsRow>
      </Section>

      <Section sx={{ alignItems: 'stretch' }}>
        <LatestCommit />
      </Section>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 8, textAlign: 'center' }}>
        Made with ❤️ in Boston, MA. Feel free to reach out with any questions or opportunities.
      </Typography>

      {/* The year autocomplete's listbox is capped at 224px (see ListboxProps
          above) — scrollable for the remaining years, but the scrollbar
          itself stays hidden rather than adding visible chrome to a small
          inline control. */}
      <style>{`
        .year-listbox {
          scrollbar-width: none;
        }
        .year-listbox::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      `}</style>
    </ScreenShell>
  );
}

export default Welcome;
