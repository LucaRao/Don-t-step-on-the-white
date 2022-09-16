import { createClient } from 'supabase-wechat-stable'

const url = "https://ccgj29a5g6hcg6519ffg.baseapi.memfiredb.com"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzIwMTAzOTcxMiwiaWF0IjoxNjYzMTE5NzEyLCJpc3MiOiJzdXBhYmFzZSJ9.IhzOscCGc3Ml8eToqecXANiNXUBfNUIwdkMZB9uWcqo"
export const supabase = createClient(url, key)