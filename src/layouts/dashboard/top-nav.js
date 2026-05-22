import PropTypes from 'prop-types';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  SvgIcon,
  useMediaQuery
} from '@mui/material';

const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        height: TOP_NAV_HEIGHT,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        {!lgUp && (
          <IconButton
            onClick={onNavOpen}
            aria-label="Abrir menú"
          >
            <SvgIcon>
              <Bars3Icon />
            </SvgIcon>
          </IconButton>
        )}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700 }}
        >
          Royal Fruit
        </Typography>
      </Stack>
      {!lgUp && <Divider orientation="vertical" flexItem sx={{ my: 1 }} />}
    </Box>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
