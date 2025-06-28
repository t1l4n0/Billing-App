import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Tabs,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { requireSubscription } from "../utils/subscription-guard.server";
import { BadgeGenerator } from "../components/badgify/BadgeGenerator";
import { BadgePresets } from "../components/badgify/BadgePresets";
import { BadgeHistory } from "../components/badgify/BadgeHistory";
import { useState, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  
  // Require active subscription to access Badgify features
  await requireSubscription(session.shop, {
    requireActive: true,
    allowTrial: true,
    redirectTo: "/app/billing"
  });

  return json({
    shop: session.shop,
  });
};

export default function Badgify() {
  const { shop } = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: 'generator',
      content: 'Badge Generator',
      panelID: 'generator-panel',
    },
    {
      id: 'presets',
      content: 'Presets',
      panelID: 'presets-panel',
    },
    {
      id: 'history',
      content: 'History',
      panelID: 'history-panel',
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelectedTab(selectedTabIndex);
  }, []);

  const handleBadgeGenerated = (badgeUrl: string, badgeMarkdown: string) => {
    // Could save to history here if needed
    console.log('Badge generated:', { badgeUrl, badgeMarkdown });
  };

  const handlePresetSelect = (preset: any) => {
    // Switch to generator tab and populate with preset data
    setSelectedTab(0);
    // Could pass preset data to generator if needed
  };

  return (
    <Page
      title="Badgify - Badge Generator"
      subtitle="Create beautiful badges for your projects and documentation"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <Banner tone="info" title="Premium Feature">
            <p>
              Badgify is included with your subscription. Create unlimited custom badges 
              for your projects, documentation, and repositories.
            </p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              <div style={{ padding: '1.5rem 0' }}>
                {selectedTab === 0 && (
                  <BadgeGenerator onBadgeGenerated={handleBadgeGenerated} />
                )}
                {selectedTab === 1 && (
                  <BadgePresets onPresetSelect={handlePresetSelect} />
                )}
                {selectedTab === 2 && (
                  <BadgeHistory />
                )}
              </div>
            </Tabs>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                About Badgify
              </Text>
              <BlockStack gap="200">
                <Text variant="bodyMd">
                  ✓ Generate custom badges instantly
                </Text>
                <Text variant="bodyMd">
                  ✓ Multiple styles and colors
                </Text>
                <Text variant="bodyMd">
                  ✓ Logo integration support
                </Text>
                <Text variant="bodyMd">
                  ✓ Ready-to-use presets
                </Text>
                <Text variant="bodyMd">
                  ✓ History and reuse functionality
                </Text>
                <Text variant="bodyMd">
                  ✓ Markdown and URL export
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Popular Use Cases
              </Text>
              <BlockStack gap="200">
                <Text variant="bodyMd">
                  • GitHub repository status
                </Text>
                <Text variant="bodyMd">
                  • Build and test indicators
                </Text>
                <Text variant="bodyMd">
                  • Technology stack display
                </Text>
                <Text variant="bodyMd">
                  • Version and license info
                </Text>
                <Text variant="bodyMd">
                  • Social proof badges
                </Text>
                <Text variant="bodyMd">
                  • Custom project branding
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}