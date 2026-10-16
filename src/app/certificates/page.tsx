'use client';

import React from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_CERTIFICATES } from '@/lib/mock-data';
import { Award, FileCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function CertificatesPage() {
  const { t } = useTranslation();

  return (
    <BaseLayout>
      <div className="space-y-8">
        <PageHeader
          icon={Award}
          title={t('certificates.title')}
          subtitle={t('certificates.subtitle')}
          badge={
            <Badge variant="green">
              {MOCK_CERTIFICATES.length} {t('certificates.validCertificates')}
            </Badge>
          }
        />

        {MOCK_CERTIFICATES.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-green-300 transition-all space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-green-50 border border-green-200 text-green-700">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md shadow-2xs">
                    {cert.certificate_code}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {cert.course_title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('certificates.issuedTo')}: <strong className="text-gray-800">{cert.user_name}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {t('certificates.issuedDate')}: <strong className="text-gray-800">{cert.issue_date}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Certificate ${cert.certificate_code} verified for ${cert.course_title}`)}
                    className="text-green-700 hover:text-green-800 hover:underline font-bold flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4 text-green-600" />
                    <span>{t('certificates.verifyCertificate')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Award}
            title={t('certificates.noCertificates')}
            description={t('certificates.noCertificatesDesc')}
          />
        )}
      </div>
    </BaseLayout>
  );
}
