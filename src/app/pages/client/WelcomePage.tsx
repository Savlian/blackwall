import React from 'react';
import { Box, Button, Icon, Icons, Text, config, toRem } from 'folds';
import { Page, PageHero, PageHeroSection } from '../../components/page';
import ClovrLabsLogo from '../../../../public/res/clovrlabs-logo-black.webp';

export function WelcomePage() {
  return (
    <Page>
      <Box
        grow="Yes"
        style={{ padding: config.space.S400, paddingBottom: config.space.S700 }}
        alignItems="Center"
        justifyContent="Center"
      >
        <PageHeroSection>
          <PageHero
            icon={<img width="170" height="auto" src={ClovrLabsLogo} alt="Clovr Labs Logo" />}
            title="Welcome to Clovr Labs"
            subTitle={
              <span>
                Reach out channel for .{' '}
                <a
                  href="https://clovrlabs.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Learn More
                </a>
              </span>
            }
          >
            <Box justifyContent="Center">
              <Box grow="Yes" style={{ maxWidth: toRem(300) }} direction="Column" gap="300">
                <Button
                  as="a"
                  href="https://clovrlabs.com/products"
                  target="_blank"
                  rel="noreferrer noopener"
                  before={<Icon size="200" src={Icons.Code} />}
                >
                  <Text as="span" size="B400" truncate>
                    Our Products
                  </Text>
                </Button>
                <Button
                  as="a"
                  href="https://clovrlabs.com/contact"
                  target="_blank"
                  rel="noreferrer noopener"
                  fill="Soft"
                  before={<Icon size="200" src={Icons.Heart} />}
                >
                  <Text as="span" size="B400" truncate>
                    Contact Us
                  </Text>
                </Button>
              </Box>
            </Box>
          </PageHero>
        </PageHeroSection>
      </Box>
    </Page>
  );
}
