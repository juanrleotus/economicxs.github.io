import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut, Plus, Edit, Trash2, Newspaper, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';

const AdminDashboard = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNewspaper, setEditingNewspaper] = useState(null);
  const [deletingNewspaper, setDeletingNewspaper] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', country_code: '' });
  const { logout, user, loading: authLoading, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchNewspapers();
    }
  }, [user]);

  const fetchNewspapers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/newspapers`);
      setNewspapers(response.data);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
      toast.error('Failed to fetch newspapers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewspaper = () => {
    setEditingNewspaper(null);
    setFormData({ title: '', url: '', country_code: '' });
    setDialogOpen(true);
  };

  const handleEditNewspaper = (newspaper) => {
    setEditingNewspaper(newspaper);
    setFormData({
      title: newspaper.title,
      url: newspaper.url,
      country_code: newspaper.country_code
    });
    setDialogOpen(true);
  };

  const handleSaveNewspaper = async () => {
    try {
      const headers = getAuthHeaders();
      
      if (editingNewspaper) {
        await axios.put(
          `${BACKEND_URL}/api/newspapers/${editingNewspaper.id}`,
          formData,
          { headers }
        );
        toast.success('Newspaper updated successfully');
      } else {
        await axios.post(
          `${BACKEND_URL}/api/newspapers`,
          formData,
          { headers }
        );
        toast.success('Newspaper added successfully');
      }
      
      setDialogOpen(false);
      fetchNewspapers();
    } catch (error) {
      console.error('Error saving newspaper:', error);
      toast.error('Failed to save newspaper');
    }
  };

  const handleDeleteNewspaper = (newspaper) => {
    setDeletingNewspaper(newspaper);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(
        `${BACKEND_URL}/api/newspapers/${deletingNewspaper.id}`,
        { headers }
      );
      toast.success('Newspaper deleted successfully');
      setDeleteDialogOpen(false);
      fetchNewspapers();
    } catch (error) {
      console.error('Error deleting newspaper:', error);
      toast.error('Failed to delete newspaper');
    }
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const uniqueCountries = new Set(newspapers.map(n => n.country_code));

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_news-by-nation/artifacts/e3iapp74_logo.jpg" 
              alt="EconomiX Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                {t('admin.dashboard')}
              </h1>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                {t('admin.welcome')}
              </p>
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">{t('nav.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  {t('admin.totalNewspapers')}
                </p>
                <p className="text-4xl font-serif font-bold text-slate-900">{newspapers.length}</p>
              </div>
              <div className="bg-slate-100 p-4">
                <Newspaper className="w-8 h-8 text-slate-700" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  {t('admin.countries')}
                </p>
                <p className="text-4xl font-serif font-bold text-slate-900">{uniqueCountries.size}</p>
              </div>
              <div className="bg-slate-100 p-4">
                <Globe className="w-8 h-8 text-slate-700" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 shadow-sm"
        >
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold text-slate-900">
              {t('admin.newspapers')}
            </h2>
            <Button
              onClick={handleAddNewspaper}
              className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
              data-testid="add-newspaper-button"
            >
              <Plus className="w-4 h-4" />
              {t('admin.addNewspaper')}
            </Button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              </div>
            ) : newspapers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>No newspapers added yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-serif font-semibold">{t('admin.title')}</TableHead>
                    <TableHead className="font-serif font-semibold">{t('admin.url')}</TableHead>
                    <TableHead className="font-serif font-semibold">{t('admin.country')}</TableHead>
                    <TableHead className="text-right font-serif font-semibold">{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newspapers.map((newspaper) => (
                    <TableRow key={newspaper.id} data-testid={`newspaper-row-${newspaper.id}`}>
                      <TableCell className="font-medium">{newspaper.title}</TableCell>
                      <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                        {newspaper.url}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono uppercase tracking-wider bg-slate-100 px-2 py-1">
                          {newspaper.country_code}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNewspaper(newspaper)}
                            className="hover:bg-slate-100"
                            data-testid={`edit-button-${newspaper.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNewspaper(newspaper)}
                            className="hover:bg-red-50 hover:text-red-600"
                            data-testid={`delete-button-${newspaper.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </motion.div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white" data-testid="newspaper-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-slate-900">
              {editingNewspaper ? t('admin.editNewspaper') : t('admin.addNewspaper')}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {editingNewspaper ? 'Update newspaper information' : 'Add a new digital newspaper'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                {t('admin.title')}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., The New York Times"
                className="border-slate-200 focus:ring-1 focus:ring-slate-900"
                data-testid="title-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium text-slate-700">
                {t('admin.url')}
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.example.com"
                className="border-slate-200 focus:ring-1 focus:ring-slate-900"
                data-testid="url-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country_code" className="text-sm font-medium text-slate-700">
                {t('admin.country')} (ISO Code)
              </Label>
              <Input
                id="country_code"
                value={formData.country_code}
                onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                placeholder="e.g., USA, ESP, FRA"
                className="border-slate-200 focus:ring-1 focus:ring-slate-900"
                maxLength={3}
                data-testid="country-input"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="hover:bg-slate-100"
              data-testid="cancel-button"
            >
              {t('admin.cancel')}
            </Button>
            <Button
              onClick={handleSaveNewspaper}
              className="bg-slate-900 text-white hover:bg-slate-800"
              disabled={!formData.title || !formData.url || !formData.country_code}
              data-testid="save-button"
            >
              {t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-serif font-bold text-slate-900">
              {t('admin.deleteNewspaper')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {t('admin.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-100" data-testid="cancel-delete-button">
              {t('admin.deleteCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="confirm-delete-button"
            >
              {t('admin.deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;