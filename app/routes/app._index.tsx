import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  Banner,
  EmptyState,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { checkSubscriptionStatus } from "../utils/subscription-guard.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    
    const subscriptionStatus = await checkSubscriptionStatus(session.shop);

    return json({
      shop: session.shop,
      authenticated: true,
      ...subscriptionStatus,
    });
  } catch (error) {
    // If authentication fails, return a safe fallback
    console.error("Authentication error:", error);
    return json({
      shop: null,
      authenticated: false,
      hasSubscription: false,
      isActive: false,
      isInTrial: false,
      trialDaysRemaining: 0,
      subscription: null,
    });
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  
  // Handle unauthenticated state
  if (!data.authenticated) {
    return (
      <Page title="Shopify Billing App">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Welcome to Billing App
                </Text>
                <Text variant="bodyMd">
                  This app needs to be accessed through the Shopify Admin to function properly.
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Please install and open this app from your Shopify Admin panel.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const { shop, subscription, isActive, isInTrial, trialDaysRemaining, hasSubscription } = data;

  // Show subscription setup if no subscription exists
  if (!hasSubscription) {
    return (
      <Page title="Welcome to Billing App">
        <Layout>
          <Layout.Section>
            <EmptyState
              heading="Get started with your subscription"
              action={{
                content: "Start Free Trial",
                url: "/app/billing",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Subscribe to unlock all features including Badgify badge generator. 
                Start with a 3-day free trial, then just $9.99/month. Cancel anytime.
              </p>
            </EmptyState>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Billing App Dashboard">
      <Layout>
        <Layout.Section>
          {isInTrial && trialDaysRemaining > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner
                title="Free Trial Active"
                tone="info"
                action={{
                  content: "Manage Billing",
                  url: "/app/billing",
                }}
              >
                <p>
                  You have {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left in your free trial. 
                  Your subscription will automatically continue at $9.99/month after the trial ends.
                </p>
              </Banner>
            </div>
          )}

          {isActive && !isInTrial && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner
                title="Subscription Active"
                tone="success"
                action={{
                  content: "Manage Billing",
                  url: "/app/billing",
                }}
              >
                <p>
                  Your subscription is active. You have full access to all app features including Badgify.
                </p>
              </Banner>
            </div>
          )}

          {subscription && subscription.status === "pending" && !isInTrial && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner
                title="Trial Expired - Action Required"
                tone="critical"
                action={{
                  content: "Complete Setup",
                  url: "/app/billing",
                }}
              >
                <p>
                  Your free trial has ended. Please complete your subscription setup to continue using the app.
                </p>
              </Banner>
            </div>
          )}
          
          <Card>
            <BlockStack gap="400">
              <div>
                <Text variant="headingMd" as="h2">
                  Welcome to {shop || "your shop"}
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Your billing app dashboard with integrated Badgify
                </Text>
              </div>
                
              {subscription && (
                <div>
                  <Text variant="headingMd" as="h3" fontWeight="medium">
                    Current Subscription
                  </Text>
                  <div style={{ marginTop: "1rem" }}>
                    <BlockStack gap="300">
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Plan:</Text>
                        <Text variant="bodyMd" fontWeight="semibold">
                          {subscription.planName || "Basic Plan"}
                        </Text>
                      </InlineStack>
                      
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Status:</Text>
                        <Badge tone={
                          subscription.status === "active" ? "success" : 
                          subscription.status === "pending" ? "attention" : 
                          "critical"
                        }>
                          {subscription.status === "active" && isInTrial ? "Trial" : 
                           subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </InlineStack>
                      
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Price:</Text>
                        <Text variant="bodyMd" fontWeight="semibold">
                          ${subscription.price || "9.99"} USD / month
                        </Text>
                      </InlineStack>

                      {isInTrial && subscription.trialEndsAt && (
                        <InlineStack gap="200" align="space-between">
                          <Text variant="bodyMd">Trial ends:</Text>
                          <Text variant="bodyMd">
                            {new Date(subscription.trialEndsAt).toLocaleDateString()}
                          </Text>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "2rem" }}>
                <InlineStack gap="300">
                  <Button variant="primary" url="/app/billing" size="large">
                    Manage Billing & Subscription
                  </Button>
                  {(isActive || isInTrial) && (
                    <Button url="/app/badgify" size="large">
                      Open Badgify
                    </Button>
                  )}
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Plan Features
              </Text>
              <div>
                <BlockStack gap="200">
                  <Text variant="bodyMd">✓ Full app access</Text>
                  <Text variant="bodyMd">✓ Badgify badge generator</Text>
                  <Text variant="bodyMd">✓ 3-day free trial</Text>
                  <Text variant="bodyMd">✓ Monthly billing ($9.99)</Text>
                  <Text variant="bodyMd">✓ Cancel anytime</Text>
                  <Text variant="bodyMd">✓ Email support</Text>
                </BlockStack>
              </div>
              
              <div style={{ marginTop: "1rem" }}>
                <Button url="/app/billing" fullWidth>
                  {hasSubscription ? "Manage Subscription" : "Start Free Trial"}
                </Button>
              </div>
            </BlockStack>
          </Card>

          {(isActive || isInTrial) && (
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  🎯 Badgify Features
                </Text>
                <div>
                  <BlockStack gap="200">
                    <Text variant="bodyMd">✓ Custom badge generator</Text>
                    <Text variant="bodyMd">✓ Multiple styles & colors</Text>
                    <Text variant="bodyMd">✓ Logo integration</Text>
                    <Text variant="bodyMd">✓ Ready-to-use presets</Text>
                    <Text variant="bodyMd">✓ Badge history & reuse</Text>
                    <Text variant="bodyMd">✓ Markdown export</Text>
                  </BlockStack>
                </div>
                
                <div style={{ marginTop: "1rem" }}>
                  <Button url="/app/badgify" fullWidth variant="primary">
                    Launch Badgify
                  </Button>
                </div>
              </BlockStack>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// Error boundary for this route
export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <Page title="Error">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Something went wrong
              </Text>
              <Text variant="bodyMd">
                We're sorry, but there was an error loading the page. Please try refreshing or contact support if the problem persists.
              </Text>
              <Button url="/app" variant="primary">
                Go to Dashboard
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}