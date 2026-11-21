// Mart Document (MartDocument {docName, docType, docFile}) — document
// viewer (image/PDF) with the file bar (file name + format badge), as in
// mart.js openDocFile. docFile is the asset key from src/theme/assets.ts.

import { useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { DocViewer } from '../../components/DocViewer';
import { EmptyState } from '../../components/EmptyState';
import { documents, type DocumentKey } from '../../theme/assets';
import { MartShell, PageSub, PageTitle } from './martUi';

export default function MartDocumentScreen() {
  const { scopeKey, currentUser } = useApp();
  const route = useRoute<RouteProp<RootStackParamList, 'MartDocument'>>();
  const { docName, docType, docFile } = route.params;
  const known = (documents as Record<string, unknown>)[docFile] !== undefined;
  const isDemo = scopeKey === '__demo__';
  const sub = isDemo ? 'Imtiaz Mega Mart · Faisalabad' : (currentUser?.business ?? '');
  return (
    <MartShell title="Document" activeTab="settings" showBack>
      <PageTitle>{docName}</PageTitle>
      <PageSub>{sub}</PageSub>
      {!known ? (
        <EmptyState title="No documents." />
      ) : (
        <DocViewer docName={docName} docType={docType} docFile={docFile as DocumentKey} />
      )}
    </MartShell>
  );
}
