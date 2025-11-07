# Alert Testing Debug Guide

## Issue: "Alert not found" when testing alerts

### Root Cause
Alerts are created in Supabase database via frontend but not automatically synced to backend's in-memory monitoring system.

### Debug Steps

#### 1. Check Backend Health
```bash
curl https://cryptoalarm.onrender.com/health
```
Should show:
- `database_connected: true`
- `api_status: "healthy"`

#### 2. Check Alert Sync Status
```bash
curl https://cryptoalarm.onrender.com/alerts/debug
```
Should show:
- `database_count` vs `memory_count` - if different, sync issue
- `sync_status.sync_needed: true/false`

#### 3. Force Manual Sync
```bash
curl -X POST https://cryptoalarm.onrender.com/alerts/sync
```
Should return:
- `synced_count: X` (number of alerts synced)

#### 4. Test Alert After Sync
Click the test button again after manual sync.

### Frontend Changes Made

#### Updated Alert Creation
- Now calls `alertAPI.syncAlerts()` after creating an alert
- Ensures backend memory is updated immediately

#### Enhanced Test Function
- Calls `alertAPI.syncAlerts()` before testing
- Better error messages and logging

### Backend Changes Made

#### Enhanced Test Endpoint
- Forces sync before looking up alert
- Better error messages showing available alerts
- Detailed logging for debugging

#### Debug Endpoint
- Shows database vs memory alert counts
- Sync status and timestamp
- Sample alert IDs for comparison

#### Status Endpoint
- Forces sync before checking status
- More accurate monitoring state

### Quick Fix Commands

#### If "not monitored" shows in UI:
1. Open browser console
2. Run: `await alertAPI.syncAlerts()`
3. Refresh page or check status again

#### If test still fails:
1. Run: `await alertAPI.debugAlerts()`
2. Check if `database_count` matches `memory_count`
3. If not, there's a sync conversion issue

### Expected Flow
1. Create alert → Stored in Supabase
2. Backend sync → Converts to monitoring format
3. Test alert → Found in memory, notification sent
4. Status shows "Monitoring"

### Log Messages to Watch For
- `✅ Synced X alerts from database`
- `✅ Found alert {id} in memory`
- `📞 Test notification sent successfully`

### Common Issues
- **Database not connected**: Check Supabase credentials
- **Sync fails**: Database conversion errors
- **Alert format mismatch**: Database vs monitoring model differences
- **Credentials missing**: Twilio not configured for notifications