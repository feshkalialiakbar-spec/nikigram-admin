import { useState, useEffect } from 'react';
import client from '@/api/client';
import { 
  BusinessApiResponse, 
  UpdateBusinessRequest, 
  UpdateBusinessResponse,
  UpdateDocumentsRequest,
  UpdateDocumentsResponse,
  DocumentErrorResponse,
  FileUploadResponse,
  UpdatePlatformsRequest,
  UpdatePlatformsResponse
} from '@/types/business';

export const useBusinessData = () => {
  const [data, setData] = useState<BusinessApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [documentsUpdateLoading, setDocumentsUpdateLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [platformsUpdateLoading, setPlatformsUpdateLoading] = useState(false);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await client.get<BusinessApiResponse>('/sys/business/', {
        params: {
          plat_limit: '5',
          plat_offset: '0',
          doc_limit: '5',
          doc_offset: '0'
        }
      });
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (updateData: UpdateBusinessRequest) => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      const response = await client.patch<UpdateBusinessResponse>('/sys/business/', updateData);
      
      // پس از به‌روزرسانی موفق، داده‌ها را دوباره دریافت می‌کنیم
      await fetchBusinessData();
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داد';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setFileUploadLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('is_featured', 'false');
      formData.append('is_private', 'false');
      formData.append('entity_type', 'profile');
      formData.append('file', file);
      
      const response = await client.post<FileUploadResponse>('/sys/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در آپلود فایل';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const updateDocuments = async (updateData: UpdateDocumentsRequest) => {
    try {
      setDocumentsUpdateLoading(true);
      setError(null);
      
      const response = await client.patch<UpdateDocumentsResponse>('/sys/business/documents', updateData);
      
      // پس از به‌روزرسانی موفق، داده‌ها را دوباره دریافت می‌کنیم
      await fetchBusinessData();
      
      return response.data;
    } catch (err: unknown) {
      // Handle validation errors (422)
      if (err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 'status' in err.response && 
          err.response.status === 422) {
        const errorData: DocumentErrorResponse = (err.response as unknown as { data: DocumentErrorResponse }).data;
        const errorMessages = errorData.detail.map(error => error.msg).join(', ');
        setError(errorMessages);
        throw new Error(errorMessages);
      }
      
      const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داد';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDocumentsUpdateLoading(false);
    }
  };

  const updatePlatforms = async (updateData: UpdatePlatformsRequest) => {
    try {
      setPlatformsUpdateLoading(true);
      setError(null);
      
      const response = await client.patch<UpdatePlatformsResponse>('/sys/business/platforms', updateData);
      
      // پس از به‌روزرسانی موفق، داده‌ها را دوباره دریافت می‌کنیم
      await fetchBusinessData();
      
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در به‌روزرسانی پلتفرم‌ها';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setPlatformsUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  return {
    data,
    loading,
    error,
    updateLoading,
    documentsUpdateLoading,
    fileUploadLoading,
    platformsUpdateLoading,
    refetch: fetchBusinessData,
    updateBusiness,
    updateDocuments,
    updatePlatforms,
    uploadFile
  };
};
