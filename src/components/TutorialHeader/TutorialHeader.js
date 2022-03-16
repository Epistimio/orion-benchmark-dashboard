import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
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
      </Header>
    )}
  />
);

export default TutorialHeader;
