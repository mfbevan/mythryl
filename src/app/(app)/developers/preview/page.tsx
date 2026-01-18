"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { AppWindow, ExternalLink, Loader2, CheckCircle2, AlertCircle, AlertTriangle, Circle, Trash2, FileJson, ScrollText } from "lucide-react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { useWindowActions } from "~/components/windows/provider";
import { useMiniapp } from "~/components/windows/windows.hooks";
import { DevelopersHeader } from "../_components/developers.header";
import { cn } from "~/lib/utils";
import { validateManifest, type ValidationStatus, type FieldValidation } from "~/server/api/schema/farcaster-manifest.validation";
import type { ResolvedFarcasterApp } from "~/server/api/schema/farcaster-manifest.validator";

interface NetworkLog {
  id: string;
  timestamp: Date;
  type: "message" | "navigation" | "error";
  data: unknown;
  direction?: "incoming" | "outgoing";
}

export default function PreviewPage() {
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const { addWindow } = useWindowActions();

  const addLog = useCallback((log: Omit<NetworkLog, "id" | "timestamp">) => {
    setLogs((prev) => [
      ...prev,
      {
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      },
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Listen for postMessage events from iframes
  useEffect(() => {
    if (!previewUrl) return;

    // Build the expected origin from the preview URL
    const expectedOrigin = `https://${previewUrl.replace(/^https?:\/\//, "").split("/")[0]}`;

    const handleMessage = (event: MessageEvent) => {
      // Only log messages from our miniapp's origin
      if (event.origin === expectedOrigin && event.data && typeof event.data === "object") {
        addLog({
          type: "message",
          data: event.data,
          direction: "incoming",
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [addLog, previewUrl]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setPreviewUrl(url.trim());
    clearLogs();
  };

  const handleOpenPreview = () => {
    if (!previewUrl) return;
    addWindow({
      type: "preview",
      url: previewUrl,
    });
  };

  return (
    <SidebarPage
      breadcrumbs={[
        { href: "/developers", label: "Developers" },
        { href: "/developers/preview", label: "Preview" },
      ]}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <DevelopersHeader />
        <main className="min-w-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6 overflow-hidden">
            <div>
              <h1 className="text-2xl font-bold">Miniapp Preview</h1>
              <p className="text-muted-foreground">
                Enter a miniapp URL to preview it and validate its manifest
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AppWindow className="size-5" />
                  Preview URL
                </CardTitle>
                <CardDescription>
                  Enter the base URL of your miniapp (e.g., warptown.com). The
                  manifest will be fetched from /.well-known/farcaster.json
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="your-miniapp.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!url.trim()}>
                    Load Manifest
                  </Button>
                </form>
              </CardContent>
            </Card>

            {previewUrl && (
              <PreviewTabs
                url={previewUrl}
                onOpenPreview={handleOpenPreview}
                logs={logs}
                onClearLogs={clearLogs}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarPage>
  );
}

interface PreviewTabsProps {
  url: string;
  onOpenPreview: () => void;
  logs: NetworkLog[];
  onClearLogs: () => void;
}

const PreviewTabs = ({ url, onOpenPreview, logs, onClearLogs }: PreviewTabsProps) => {
  const { app, isLoading, isError } = useMiniapp(url);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
          <span className="text-muted-foreground ml-2">Loading manifest...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError || !app) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">
            Failed to load manifest from {url}/.well-known/farcaster.json
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="manifest" className="w-full overflow-hidden">
      <TabsList>
        <TabsTrigger value="manifest" className="gap-2">
          <FileJson className="size-4" />
          Manifest
        </TabsTrigger>
        <TabsTrigger value="logs" className="gap-2">
          <ScrollText className="size-4" />
          Logs
          {logs.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {logs.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manifest" className="overflow-hidden">
        <ManifestDetails app={app} onOpenPreview={onOpenPreview} />
      </TabsContent>
      <TabsContent value="logs" className="overflow-hidden">
        <LogsPanel logs={logs} onClear={onClearLogs} />
      </TabsContent>
    </Tabs>
  );
};

interface ManifestDetailsProps {
  app: ResolvedFarcasterApp;
  onOpenPreview: () => void;
}

const ValidationIcon = ({ status }: { status: ValidationStatus }) => {
  switch (status) {
    case "valid":
      return <CheckCircle2 className="size-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="size-4 text-yellow-500" />;
    case "error":
      return <AlertCircle className="size-4 text-red-500" />;
    case "missing":
      return <Circle className="text-muted-foreground size-4" />;
  }
};

const ValidationCell = ({ validation, value }: { validation: FieldValidation; value: unknown }) => {
  const getDisplayValue = (): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "—";
  };
  const displayValue = getDisplayValue();

  return (
    <div className="flex flex-col gap-1 overflow-hidden">
      <div className="flex items-start gap-2 overflow-hidden">
        <ValidationIcon status={validation.status} />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="truncate font-mono text-sm" title={displayValue}>
            {displayValue}
          </div>
          <div
            className={cn(
              "text-xs",
              validation.status === "valid" && "text-muted-foreground",
              validation.status === "warning" && "text-yellow-600",
              validation.status === "error" && "text-red-600",
              validation.status === "missing" && "text-muted-foreground",
            )}
          >
            {validation.message}
          </div>
          {validation.suggestion && (
            <div className="text-muted-foreground mt-0.5 text-xs italic">
              {validation.suggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ManifestDetails = ({ app, onOpenPreview }: ManifestDetailsProps) => {
  const { config, accountAssociation } = app;
  const validation = validateManifest(config, accountAssociation);

  const manifestFields = [
    { key: "version", label: "Version", required: false },
    { key: "name", label: "Name", required: true },
    { key: "subtitle", label: "Subtitle", required: false },
    { key: "description", label: "Description", required: false },
    { key: "tagline", label: "Tagline", required: false },
    { key: "homeUrl", label: "Home URL", required: true },
    { key: "iconUrl", label: "Icon URL", required: true },
    { key: "imageUrl", label: "Image URL", required: false },
    { key: "heroImageUrl", label: "Hero Image URL", required: false },
    { key: "splashImageUrl", label: "Splash Image URL", required: false },
    { key: "splashBackgroundColor", label: "Splash Background", required: false },
    { key: "buttonTitle", label: "Button Title", required: false },
    { key: "webhookUrl", label: "Webhook URL", required: false },
    { key: "primaryCategory", label: "Primary Category", required: false },
    { key: "tags", label: "Tags", required: false },
    { key: "canonicalDomain", label: "Canonical Domain", required: false },
    { key: "ogTitle", label: "OG Title", required: false },
    { key: "ogDescription", label: "OG Description", required: false },
    { key: "ogImageUrl", label: "OG Image URL", required: false },
    { key: "accountAssociation", label: "Account Association", required: false },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {config.iconUrl && (
              <Image
                src={config.iconUrl}
                alt={config.name}
                width={48}
                height={48}
                className="shrink-0 rounded-lg"
                unoptimized
              />
            )}
            <div className="min-w-0">
              <CardTitle className="truncate">{config.name}</CardTitle>
              {config.subtitle && (
                <CardDescription className="truncate">{config.subtitle}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant={
                validation.overallStatus === "valid"
                  ? "default"
                  : validation.overallStatus === "warning"
                    ? "secondary"
                    : "destructive"
              }
            >
              {validation.overallStatus === "valid" && "Valid"}
              {validation.overallStatus === "warning" && `${validation.warnings.length} Warnings`}
              {validation.overallStatus === "error" && `${validation.errors.length} Errors`}
            </Badge>
            <Button onClick={onOpenPreview}>
              <AppWindow className="size-4" />
              Open Preview
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 overflow-hidden">
        {config.tags && config.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="w-full overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Property</TableHead>
                <TableHead>Value & Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manifestFields.map((field) => {
                const value =
                  field.key === "accountAssociation"
                    ? accountAssociation
                      ? "Signed"
                      : undefined
                    : config[field.key as keyof typeof config];
                const fieldValidation = validation.fields[field.key];
                if (!fieldValidation) return null;

                return (
                  <TableRow key={field.key}>
                    <TableCell className="align-top font-medium">
                      <div className="flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </div>
                    </TableCell>
                    <TableCell className="overflow-hidden">
                      <ValidationCell validation={fieldValidation} value={value} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <p className="text-muted-foreground text-xs">
          * Required field. Validation based on{" "}
          <a
            href="https://miniapps.farcaster.xyz/docs/specification"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Farcaster Mini Apps Specification
            <ExternalLink className="ml-1 inline size-3" />
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

interface LogsPanelProps {
  logs: NetworkLog[];
  onClear: () => void;
}

const LogsPanel = ({ logs, onClear }: LogsPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="size-5" />
              Network Logs
            </CardTitle>
            <CardDescription>
              postMessage events and communications from the miniapp iframe
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClear} disabled={logs.length === 0}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-auto rounded-md border" ref={scrollRef}>
          {logs.length === 0 ? (
            <div className="text-muted-foreground flex h-full items-center justify-center py-12 text-sm">
              No logs yet. Open the preview to see postMessage events.
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {logs.map((log) => (
                <div key={log.id} className="rounded-md border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          log.type === "error"
                            ? "destructive"
                            : log.type === "message"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {log.type}
                      </Badge>
                      {log.direction && (
                        <Badge variant="outline">{log.direction}</Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-muted-foreground overflow-x-auto text-xs">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
