import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react'; // Importa useState
import { Box, ButtonBase, List, ListItem, Collapse } from '@mui/material'; // Importa List, ListItem y Collapse

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, subItems } = props;
  const [open, setOpen] = useState(false); // Estado para controlar la expansión de los subelementos

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
      {subItems ? ( // Si hay subelementos, renderiza un elemento de lista con un botón para expandir/cerrar
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
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            }}
            onClick={handleToggle} // Agrega un controlador de clic para expandir/cerrar
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
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {subItems.map((subItem) => (
                <ListItem button key={subItem.title} component={NextLink} href={subItem.path}>
                  {subItem.title}
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      ) : ( // Si no hay subelementos, renderiza un botón base sin capacidad de expandirse
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
  subItems: PropTypes.arrayOf(PropTypes.shape({ // Propiedad para pasar subelementos
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })),
};
