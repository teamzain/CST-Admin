'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Module } from './module-item';

interface ModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (module: Partial<Module>) => void;
    module?: Module;
}

export function ModuleModal({ isOpen, onClose, onSave, module }: ModuleModalProps) {
    const [formData, setFormData] = useState<Partial<Module>>({
        title: '',
        description: '',
    });

    useEffect(() => {
        if (module) {
            setFormData({
                title: module.title,
                description: module.description,
            });
        } else {
            setFormData({
                title: '',
                description: '',
            });
        }
    }, [module, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{module ? 'Edit Module' : 'Create Module'}</DialogTitle>
                        <DialogDescription>
                            {module ? 'Update the module details below.' : 'Add a new module to organize your course content.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Module Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Introduction to Security Fundamentals"
                                required
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of what this module covers..."
                                rows={3}
                                className="bg-background border-input"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                            {module ? 'Update Module' : 'Create Module'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
