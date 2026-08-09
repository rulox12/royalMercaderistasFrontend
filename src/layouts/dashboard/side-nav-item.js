import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {
  Box,
  ButtonBase,
  Collapse,
  List,
  ListItem,
  SvgIcon,
} from '@mui/material';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, subItems } = props;
  const router = useRouter();
  const pathname = router.pathname;

  const isSubItemActive = useMemo(
    () => Boolean(subItems?.some((subItem) => pathname === subItem.path)),
    [pathname, subItems]
  );

  const [open, setOpen] = useState(isSubItemActive);

  useEffect(() => {
    if (isSubItemActive) {
      setOpen(true);
    }
  }, [isSubItemActive]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const linkProps = path
    ? external
      ? {
          component: 'a',
          href: path,
          target: '_blank',
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      {subItems ? (
        <>
          <ButtonBase
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              pl: '16px',
              pr: '16px',
              py: '6px',
              textAlign: 'left',
              width: '100%',
              ...(active && {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              }),
              ...(isSubItemActive && {
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
              }),
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            }}
            onClick={handleToggle}
          >
            {icon && (
              <Box
                component="span"
                sx={{
                  alignItems: 'center',
                  color: 'neutral.400',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  mr: 2,
                  ...(active && {
                    color: 'primary.main',
                  }),
                }}
              >
                {icon}
              </Box>
            )}
            <Box
              component="span"
              sx={{
                color: 'neutral.400',
                flexGrow: 1,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: '24px',
                whiteSpace: 'nowrap',
                ...(active && {
                  color: 'common.white',
                }),
                ...(disabled && {
                  color: 'neutral.500',
                }),
                ...(isSubItemActive && {
                  color: 'common.white',
                }),
              }}
            >
              {title}
            </Box>
            <SvgIcon
              fontSize="small"
              sx={{
                color: 'neutral.400',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <ExpandMoreOutlinedIcon />
            </SvgIcon>
          </ButtonBase>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                mt: 0.5,
                pl: 5.5,
                pr: 1,
              }}
            >
              {subItems.map((subItem) => {
                const subItemActive = pathname === subItem.path;

                return (
                  <ListItem
                    key={subItem.title}
                    disablePadding
                    sx={{ mb: 0.25 }}
                  >
                    <ButtonBase
                      component={NextLink}
                      href={subItem.path}
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.7,
                        color: subItemActive ? 'common.white' : 'neutral.300',
                        fontSize: 13,
                        fontWeight: subItemActive ? 700 : 500,
                        lineHeight: '20px',
                        backgroundColor: subItemActive
                          ? 'rgba(99, 102, 241, 0.25)'
                          : 'transparent',
                        borderLeft: subItemActive
                          ? '2px solid rgba(129, 140, 248, 0.95)'
                          : '2px solid transparent',
                        transition: 'all 0.18s ease',
                        '&:hover': {
                          color: 'common.white',
                          backgroundColor: 'rgba(99, 102, 241, 0.16)',
                        },
                      }}
                    >
                      {subItem.title}
                    </ButtonBase>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </>
      ) : (
        <ButtonBase
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            pl: '16px',
            pr: '16px',
            py: '6px',
            textAlign: 'left',
            width: '100%',
            ...(active && {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }),
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            },
          }}
          {...linkProps}
        >
          {icon && (
            <Box
              component="span"
              sx={{
                alignItems: 'center',
                color: 'neutral.400',
                display: 'inline-flex',
                justifyContent: 'center',
                mr: 2,
                ...(active && {
                  color: 'primary.main',
                }),
              }}
            >
              {icon}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: 'neutral.400',
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '24px',
              whiteSpace: 'nowrap',
              ...(active && {
                color: 'common.white',
              }),
              ...(disabled && {
                color: 'neutral.500',
              }),
            }}
          >
            {title}
          </Box>
        </ButtonBase>
      )}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  subItems: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })),
};
