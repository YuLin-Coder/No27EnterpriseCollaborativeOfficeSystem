package com.justerdu.io.base.dao.impl;

import com.justerdu.io.base.dao.IBaseDao;
import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.Parameter;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.jdbc.ReturningWork;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate4.HibernateCallback;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.sql.*;
import java.util.*;


@Component
public class BaseDaoImpl<T> implements IBaseDao<T> {

    @Autowired
    private HibernateTemplate hibernateTemplate;
    private Class<T> entityClass;
    private static final int BATCH_MAX_ROW = 10;

    public BaseDaoImpl() {
    }

    public BaseDaoImpl(Class<T> entityClass) {
        this.entityClass = entityClass;
    }


    @Override
    public T save(T entity) throws Exception {
        hibernateTemplate.save(entity);
        return entity;
    }

    @Override
    public int batchSave(final List<T> array) throws Exception {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Integer>() {
                    public Integer doInHibernate(Session session)
                            throws HibernateException {
                        for (int i = 0; i < array.size(); ++i) {
                            session.save(array.get(i));
                            if (i % BATCH_MAX_ROW == 0) {
                                session.flush();
                                session.clear();
                            }
                        }
                        session.flush();
                        session.clear();
                        return array.size();
                    }
                });
    }

    @Override
    public int batchUpdate(final List<T> array) throws Exception {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Integer>() {
                    public Integer doInHibernate(Session session)
                            throws HibernateException {
                        for (int i = 0; i < array.size(); ++i) {
                            session.update(array.get(i));
                            if (i % BATCH_MAX_ROW == 0) {
                                session.flush();
                                session.clear();
                            }
                        }
                        session.flush();
                        session.clear();
                        return array.size();
                    }
                });
    }

    @Override
    public int batchSave(final T[] array) throws Exception {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Integer>() {
                    public Integer doInHibernate(Session session)
                            throws HibernateException {
                        for (int i = 0; i < array.length; ++i) {
                            session.save(array[i]);
                            if (i % BATCH_MAX_ROW == 0) {
                                session.flush();
                                session.clear();
                            }
                        }
                        session.flush();
                        session.clear();
                        return array.length;
                    }
                });
    }

    @Override
    public T saveOrUpdate(T entity) throws Exception {
        hibernateTemplate.saveOrUpdate(entity);
        return entity;
    }

    @Override
    public T update(T entity) throws Exception {
        hibernateTemplate.update(entity);
        return entity;
    }

    @Override
    public int update(final String hql) throws Exception {
        return update(hql, null);
    }

    @Override
    public int update(final String hql, final Parameter parameter) throws Exception {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Integer>() {
                    @Override
                    public Integer doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(hql);
                        setParameter(query, parameter);
                        return query.executeUpdate();
                    }
                });
    }

    @Override
    public void delete(T entity) throws Exception {
        hibernateTemplate.delete(entity);
    }

    @Override
    public int deleteWithHql(final String hql) throws Exception {
        return deleteWithHql(hql, null);
    }

    @Override
    public int deleteWithHql(final String hql, final Parameter parameter) throws Exception {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Integer>() {
                    @Override
                    public Integer doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(hql);
                        setParameter(query, parameter);
                        return query.executeUpdate();
                    }
                });
    }

    @Override
    public void deleteAll(Collection entities) throws Exception {
        hibernateTemplate.deleteAll(entities);
    }

    @Override
    public T getOne(int id) {
        return hibernateTemplate.get(entityClass, id);
    }

    @Override
    public T loadOne(int id) {
        return hibernateTemplate.load(entityClass, id);
    }

    @Override
    public T findOne(final String hql) {
        return findOne(hql, null);
    }

    @Override
    public T findOne(final String hql, final Parameter parameter) {

        return hibernateTemplate.executeWithNativeSession(new HibernateCallback<T>() {
            @Override
            @SuppressWarnings("unchecked")
            public T doInHibernate(Session session) throws HibernateException {
                Query query = session.createQuery(hql);
                setParameter(query, parameter);
                return (T) query.setMaxResults(1).uniqueResult();
            }
        });
    }

    @Override
    public Object findOneWithAny(final String hql) {
        return findOneWithAny(hql, null);
    }

    @Override
    public Object findOneWithAny(final String hql, final Parameter parameter) {
        return hibernateTemplate.executeWithNativeSession(new HibernateCallback() {
            @Override
            public Object doInHibernate(Session session) throws HibernateException {
                Query query = session.createQuery(hql);
                setParameter(query, parameter);
                return query.setMaxResults(1).uniqueResult();
            }
        });
    }

    @Override
    public long findCount(final String hql) {
        return findCount(hql, null);
    }

    @Override
    public long findCount(final String hql, final Parameter parameter) {
        Long l = hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Long>() {
                    @Override
                    public Long doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(hql);
                        setParameter(query, parameter);
                        return (Long) query.setMaxResults(1).uniqueResult();
                    }
                });
        return l == null ? 0 : l;
    }

    @Override
    public List<T> findList(final String hql, final Parameter parameter) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<List<T>>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List<T> doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(hql);
                        setParameter(query, parameter);
                        return query.list();
                    }
                });
    }

    @Override
    public List<T> findList(String hql) {
        return findList(hql, null);
    }

    @Override
    public List findListWithAny(String hql) {
        return findListWithAny(hql, null);
    }

    @Override
    public List findListWithAny(final String hql, final Parameter parameter) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<List>() {
                    @Override
                    public List doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(hql);
                        setParameter(query, parameter);
                        return query.list();
                    }
                });
    }


    @Override
    public Page<T> findPage(final int currentPage, final int pageSize, final String queryHql, final String countHql, final Parameter parameter) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Page<T>>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public Page<T> doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(queryHql);
                        setParameter(query, parameter);
                        query.setFirstResult(pageSize * (currentPage - 1));
                        query.setMaxResults(pageSize);
                        long totalRecords = findCount(countHql, parameter);
                        return new Page<T>(query.list(), totalRecords, currentPage, pageSize);
                    }
                });
    }

    @Override
    public Page findPageWithAny(final int currentPage, final int pageSize, final String queryHql, final String countHql, final Parameter parameter) {
        return findPageWithAny(currentPage, pageSize, queryHql, countHql, parameter, parameter);
    }

    @Override
    public Page<T> findPage(final int currentPage, final int pageSize, final String queryHql, final String countHql) {
        return findPage(currentPage, pageSize, queryHql, countHql, null);
    }

    @Override
    public Page findPageWithAny(final int currentPage, final int pageSize, final String queryHql, final String countHql) {
        return findPageWithAny(currentPage, pageSize, queryHql, countHql, null);
    }

    @Override
    public Page findPageWithAny(final int currentPage, final int pageSize, final String queryHql, final String countHql, final Parameter queryParameter, final Parameter countParameter) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Page>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public Page doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(queryHql);
                        setParameter(query, queryParameter);
                        query.setFirstResult(pageSize * (currentPage - 1));
                        query.setMaxResults(pageSize);
                        long totalRecords = findCount(countHql, countParameter);
                        return new Page(query.list(), totalRecords, currentPage, pageSize);
                    }
                });
    }

    @Override
    public Page findPageBySql(final String sql, final String countSql, final Class clazz, final int current, final int size) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Page>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public Page doInHibernate(Session session) throws HibernateException {
                        Query query = session.createSQLQuery(sql).setResultTransformer(Transformers.aliasToBean(clazz));
                        query.setFirstResult(current * (size - 1));
                        query.setMaxResults(size);
                        List list = query.list();
                        return new Page(list, findCountBySql(countSql), current, size);
                    }
                }
        );
    }

    @Override
    public long findCountBySql(final String hql) {
        Long l = hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<Long>() {
                    @Override
                    public Long doInHibernate(Session session) throws HibernateException {
                        Query query = session.createSQLQuery(hql);
//                        setParameter(query, parameter);
                        return Long.parseLong(query.setMaxResults(1).uniqueResult().toString());
                    }
                });
        return l == null ? 0 : l;
    }

    @Override
    public List<T> findMore(final int begin, final int size, final String queryHql, final Parameter queryParameter) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<List<T>>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List<T> doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(queryHql);
                        setParameter(query, queryParameter);
                        query.setFirstResult(begin);
                        query.setMaxResults(size);
                        return query.list();
                    }
                });
    }

    @Override
    public List<T> findMore(final int begin, final int size, final String queryHql) {
        return findMore(begin, size, queryHql, null);
    }

    @Override
    public List findMoreWithAny(final int begin, final int size, final String queryHql, final Parameter queryParameter) {
        return hibernateTemplate.executeWithNativeSession(
                new HibernateCallback<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List doInHibernate(Session session) throws HibernateException {
                        Query query = session.createQuery(queryHql);
                        setParameter(query, queryParameter);
                        query.setFirstResult(begin);
                        query.setMaxResults(size);
                        return query.list();
                    }
                });
    }

    @Override
    public List findMoreWithAny(final int begin, final int size, final String queryHql) {
        return findMoreWithAny(begin, size, queryHql, null);
    }


    private void setParameter(Query query, Parameter parameter) {
        if (parameter != null) {
            Set<String> keySet = parameter.keySet();
            for (String string : keySet) {
                Object value = parameter.get(string);
                if (value instanceof Collection<?>) {
                    query.setParameterList(string, (Collection<?>) value);
                } else if (value instanceof Object[]) {
                    query.setParameterList(string, (Object[]) value);
                } else {
                    query.setParameter(string, value);
                }
            }
        }
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public <T> Page<T> getObjectBySql(final String sql, final String countSql, final Class<T> objectClazz, final int current, final int size) throws Exception {
        return hibernateTemplate.executeWithNativeSession(new HibernateCallback<Page>() {

            @Override
            public Page doInHibernate(final Session session) throws HibernateException {
                @SuppressWarnings("unchecked")
                ResultSet resultSet = (ResultSet) session.doReturningWork(
                        new ReturningWork() {
                            @Override
                            public ResultSet execute(Connection connection) throws SQLException {
                                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                                preparedStatement.setMaxRows(current * size);//实现分页，注意当需要翻页到10页以后，性能比较差改为子查询来实现分页
                                ResultSet resultSet = preparedStatement.executeQuery();

                                return resultSet;
                            }
                        }
                );

                ResultSet countResultSet = (ResultSet) session.doReturningWork(
                        new ReturningWork() {
                            @Override
                            public ResultSet execute(Connection connection) throws SQLException {
                                PreparedStatement preparedStatement = connection.prepareStatement(countSql);
                                ResultSet resultSet = preparedStatement.executeQuery();
                                return resultSet;
                            }
                        }
                );

                ResultSetMetaData resultSetMetaData = null; //获得列集
                try {
                    resultSetMetaData = resultSet.getMetaData();
                    int columnCount = resultSetMetaData.getColumnCount();
                    List<T> list = new ArrayList<T>();
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("java.lang.Integer", "getInt");
                    map.put("java.lang.Long", "getInt");
                    map.put("java.sql.Timestamp", "getTimestamp");
                    map.put("java.lang.String", "getString");
                    map.put("java.lang.Float", "getFloat");
//                    map.put("java.lang.Boolean", "getBoolean");
                    resultSet.absolute((current - 1) * size);
                    while (resultSet.next()) {
                        T returnObject = objectClazz.newInstance();
                        for (int colNum = 1; colNum <= columnCount; colNum++) {
                            String colName = resultSetMetaData.getColumnLabel(colNum);
                            Field field = objectClazz.getDeclaredField(colName);
                            if (!Modifier.isPublic(field.getModifiers())) {
                                field.setAccessible(true);
                            }

                            if (resultSet.getObject(colName) != null) {
                                String value = map.get(resultSet.getObject(colName).getClass().getName());
                                if (value != null) {
                                    Method getValue = resultSet.getClass().getMethod(value, new Class[]{String.class});
                                    field.set(returnObject, getValue.invoke(resultSet, new Object[]{colName}));
                                }

                            } else {
                                field.set(returnObject, null);
                            }


                        }
                        list.add(returnObject);

                    }

                    boolean result = countResultSet.next();
                    long records = 0;
                    if (result) {
                        records = countResultSet.getInt(1);
                    }


                    Page<T> page = new Page<T>(list, records, current, size);
                    return page;
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }

            }
        });


    }


}
