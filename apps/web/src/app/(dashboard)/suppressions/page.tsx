"use client";

import { useState } from "react";
import AddSuppressionDialog from "./add-suppression";
import BulkAddSuppressionsDialog from "./bulk-add-suppressions";
import SuppressionList from "./suppression-list";
import SuppressionStats from "./suppression-stats";
import { Button } from "@unsend/ui/src/button";
import { Plus, Upload } from "lucide-react";

export default function SuppressionsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkAddDialog, setShowBulkAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-2xl">Suppression List</h1>
          <p className="text-muted-foreground">
            Manage email addresses that are blocked from receiving emails
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkAddDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Add
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Suppression
          </Button>
        </div>
      </div>

      {/* Stats */}
      <SuppressionStats />

      {/* Suppression List */}
      <SuppressionList />

      {/* Dialogs */}
      <AddSuppressionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <BulkAddSuppressionsDialog
        open={showBulkAddDialog}
        onOpenChange={setShowBulkAddDialog}
      />
    </div>
  );
}
