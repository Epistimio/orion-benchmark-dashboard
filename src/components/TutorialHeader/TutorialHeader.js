import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  SkipToContent,
} from 'carbon-components-react';
import { Link } from 'react-router-dom';

const TutorialHeader = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="Orion Dashboard">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName element={Link} to="/" prefix="Oríon" replace>
          Dashboard
        </HeaderName>
        <HeaderNavigation aria-label="Oríon Dashboard">
          <HeaderMenuItem element={Link} to="/status" replace>
            Status
          </HeaderMenuItem>
          <HeaderMenuItem element={Link} to="/visualizations" replace>
            Visualizations
          </HeaderMenuItem>
          <HeaderMenuItem element={Link} to="/database" replace>
            Database
          </HeaderMenuItem>
          <HeaderMenuItem element={Link} to="/configuration" replace>
            Configuration
          </HeaderMenuItem>
        </HeaderNavigation>
      </Header>
    )}
  />
);

export default TutorialHeader;
