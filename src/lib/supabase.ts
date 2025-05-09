import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 관리 클래스
 * - 환경 변수 검증 및 클라이언트 초기화 로직 통합
 * - 싱글톤 패턴 적용으로 인스턴스 재사용
 */
class SupabaseClient {
  private static instance: SupabaseClient;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    // 환경 변수에서 Supabase URL과 API 키 가져오기
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 환경 변수 검증
    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "Supabase configuration is incomplete. Some features may not work correctly."
      );
    }

    // Supabase 클라이언트 생성
    this.client = createClient(supabaseUrl || "", supabaseKey || "", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  /**
   * Supabase 클라이언트 인스턴스 접근자
   * @returns Supabase 클라이언트 인스턴스
   */
  public static getClient() {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = new SupabaseClient();
    }
    return SupabaseClient.instance.client;
  }
}

// 단일 Supabase 클라이언트 인스턴스 내보내기
const supabase = SupabaseClient.getClient();
export default supabase;
