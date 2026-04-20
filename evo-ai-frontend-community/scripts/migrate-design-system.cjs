#!/usr/bin/env node
/**
 * Migration script: @evoapi/design-system barrel imports → sub-path imports
 *
 * Converts:
 *   import { Button, Input } from '@evoapi/design-system';
 * To:
 *   import { Button } from '@evoapi/design-system/button';
 *   import { Input } from '@evoapi/design-system/input';
 */

const fs = require('fs');
const path = require('path');

const COMPONENT_MAP = {
  Button: 'button',
  Input: 'input',
  Label: 'label',
  Badge: 'badge',
  Card: 'card',
  CardContent: 'card',
  CardHeader: 'card',
  CardTitle: 'card',
  CardDescription: 'card',
  CardFooter: 'card',
  Dialog: 'dialog',
  DialogContent: 'dialog',
  DialogHeader: 'dialog',
  DialogTitle: 'dialog',
  DialogDescription: 'dialog',
  DialogFooter: 'dialog',
  DialogClose: 'dialog',
  Select: 'select',
  SelectContent: 'select',
  SelectItem: 'select',
  SelectTrigger: 'select',
  SelectValue: 'select',
  Textarea: 'textarea',
  Switch: 'switch',
  Checkbox: 'checkbox',
  Avatar: 'avatar',
  AvatarFallback: 'avatar',
  AvatarImage: 'avatar',
  Tooltip: 'tooltip',
  TooltipTrigger: 'tooltip',
  TooltipContent: 'tooltip',
  Popover: 'popover',
  Command: 'command',
  CommandDialog: 'command',
  CommandInput: 'command',
  CommandList: 'command',
  CommandEmpty: 'command',
  CommandGroup: 'command',
  CommandItem: 'command',
  CommandShortcut: 'command',
  DropdownMenu: 'dropdown-menu',
  DropdownMenuContent: 'dropdown-menu',
  DropdownMenuItem: 'dropdown-menu',
  DropdownMenuLabel: 'dropdown-menu',
  DropdownMenuSeparator: 'dropdown-menu',
  DropdownMenuTrigger: 'dropdown-menu',
  Tabs: 'tabs',
  TabsContent: 'tabs',
  TabsList: 'tabs',
  TabsTrigger: 'tabs',
  Table: 'table',
  TableBody: 'table',
  TableCell: 'table',
  TableHead: 'table',
  TableHeader: 'table',
  TableRow: 'table',
  Separator: 'separator',
  Skeleton: 'skeleton',
  Progress: 'progress',
  Slider: 'slider',
  Toggle: 'toggle',
  Alert: 'alert',
  AlertDialog: 'alert-dialog',
  AlertDialogAction: 'alert-dialog',
  AlertDialogCancel: 'alert-dialog',
  AlertDialogContent: 'alert-dialog',
  AlertDialogDescription: 'alert-dialog',
  AlertDialogFooter: 'alert-dialog',
  AlertDialogHeader: 'alert-dialog',
  AlertDialogTitle: 'alert-dialog',
  AspectRatio: 'aspect-ratio',
  Collapsible: 'collapsible',
  CollapsibleContent: 'collapsible',
  CollapsibleTrigger: 'collapsible',
  NavigationMenu: 'navigation-menu',
  ScrollArea: 'scroll-area',
  Sheet: 'sheet',
  SheetContent: 'sheet',
  SheetHeader: 'sheet',
  SheetTitle: 'sheet',
  SheetDescription: 'sheet',
  SheetFooter: 'sheet',
  SheetClose: 'sheet',
  Menubar: 'menubar',
  MenubarContent: 'menubar',
  MenubarItem: 'menubar',
  MenubarLabel: 'menubar',
  MenubarSeparator: 'menubar',
  MenubarTrigger: 'menubar',
  Pagination: 'pagination',
  PaginationContent: 'pagination',
  PaginationItem: 'pagination',
  PaginationLink: 'pagination',
  PaginationNext: 'pagination',
  PaginationPrev: 'pagination',
  Breadcrumb: 'breadcrumb',
  BreadcrumbItem: 'breadcrumb',
  BreadcrumbLink: 'breadcrumb',
  BreadcrumbList: 'breadcrumb',
  BreadcrumbSeparator: 'breadcrumb',
  ToggleGroup: 'toggle-group',
  ToggleGroupItem: 'toggle-group',
  Form: 'form',
  FormField: 'form',
  FormItem: 'form',
  FormLabel: 'form',
  FormControl: 'form',
  FormDescription: 'form',
  FormMessage: 'form',
  FormSubmit: 'form',
  Calendar: 'calendar',
  InputOTP: 'input-otp',
  InputOTPGroup: 'input-otp',
  InputOTPSeparator: 'input-otp',
  InputOTPSlot: 'input-otp',
  Carousel: 'carousel',
  CarouselContent: 'carousel',
  CarouselItem: 'carousel',
  CarouselNext: 'carousel',
  CarouselPrevious: 'carousel',
  Chart: 'chart',
  HoverCard: 'hover-card',
  Resizable: 'resizable',
  ResizableHandle: 'resizable',
  ResizablePanel: 'resizable',
  RadioGroup: 'radio-group',
  RadioGroupItem: 'radio-group',
  Sonner: 'sonner',
  Toaster: 'sonner',
};

function parseImports(content) {
  const imports = [];
  const regex = /import \{([^}]+)\} from ['"]@evoapi\/design-system['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importStr = match[1];
    const components = importStr.split(',').map(c => c.trim()).filter(c => c);
    imports.push({
      full: match[0],
      start: match.index,
      end: match.index + match[0].length,
      components,
    });
  }
  return imports;
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const imports = parseImports(content);

  if (imports.length === 0) return false;

  let modified = false;
  // Process from end to start to preserve positions
  for (let i = imports.length - 1; i >= 0; i--) {
    const imp = imports[i];

    // Group components by their sub-path
    const bySubPath = {};
    for (const comp of imp.components) {
      const subPath = COMPONENT_MAP[comp];
      if (subPath) {
        if (!bySubPath[subPath]) bySubPath[subPath] = [];
        bySubPath[subPath].push(comp);
      } else {
        // Unknown component - keep in barrel import
        if (!bySubPath.__barrel__) bySubPath.__barrel__ = [];
        bySubPath.__barrel__.push(comp);
      }
    }

    // Build new import lines
    const newImports = [];
    const seen = new Set();

    // First add known components with sub-paths
    for (const [subPath, components] of Object.entries(bySubPath)) {
      if (subPath === '__barrel__') continue;
      for (const comp of components) {
        if (!seen.has(comp)) {
          newImports.push(`import { ${comp} } from '@evoapi/design-system/${subPath}';`);
          seen.add(comp);
        }
      }
    }

    // Then add barrel imports for unknown components
    const barrelComps = bySubPath.__barrel__ || [];
    if (barrelComps.length > 0) {
      newImports.push(`import { ${barrelComps.join(', ')} } from '@evoapi/design-system';`);
    }

    // Replace the old import with new imports
    const before = content.substring(0, imp.start);
    const after = content.substring(imp.end);
    content = before + newImports.join('\n') + after;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }

  return modified;
}

const srcDir = path.join(__dirname, '..', 'src');
let totalFiles = 0;
let migratedFiles = 0;

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        processDir(fullPath);
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      totalFiles++;
      if (migrateFile(fullPath)) {
        migratedFiles++;
        console.log(`Migrated: ${path.relative(srcDir, fullPath)}`);
      }
    }
  }
}

processDir(srcDir);
console.log(`\nTotal files: ${totalFiles}, Migrated: ${migratedFiles}`);