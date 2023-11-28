package com.justerdu.io.base.dao;


import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.Parameter;

import java.util.Collection;
import java.util.List;

public interface IBaseDao<T> {

    T save(T entity) throws Exception;

    int batchSave(List<T> array) throws Exception;

    int batchUpdate(List<T> array) throws Exception;

    int batchSave(T[] array) throws Exception;

    T saveOrUpdate(T entity) throws Exception;

    T update(T entity) throws Exception;

    int update(String hql) throws Exception;

    int update(String hql, Parameter parameter) throws Exception;

    void delete(T entity) throws Exception;

    int deleteWithHql(String hql) throws Exception;

    int deleteWithHql(String hql, Parameter parameter) throws Exception;

    void deleteAll(Collection entities) throws Exception;

    T getOne(int id);

    T loadOne(int id);

    T findOne(String hql);

    T findOne(String hql, Parameter parameter);

    Object findOneWithAny(String hql);

    Object findOneWithAny(String hql, Parameter parameter);

    long findCount(String hql);

    long findCount(String hql, Parameter parameter);

    List<T> findList(String hql, Parameter parameter);

    List<T> findList(String hql);

    List findListWithAny(String hql);

    List findListWithAny(String hql, Parameter parameter);

    Page<T> findPage(int currentPage, int pageSize, String queryHql, String countHql, Parameter parameter);

    Page findPageWithAny(int currentPage, int pageSize, String queryHql, String countHql, Parameter parameter);

    Page<T> findPage(int currentPage, int pageSize, String queryHql, String countHql);

    Page findPageWithAny(int currentPage, int pageSize, String queryHql, String countHql);

    Page findPageWithAny(int currentPage, int pageSize, String queryHql, String countHql, Parameter queryParameter, Parameter countParameter);

    Page findPageBySql(String sql, String countSql, Class clazz, int current, int size);

    long findCountBySql(String hql);

    List<T> findMore(int begin, int size, String queryHql, Parameter queryParameter);

    List<T> findMore(int begin, int size, String queryHql);

    List findMoreWithAny(int begin, int size, String queryHql, Parameter queryParameter);

    List findMoreWithAny(int begin, int size, String queryHql);

    <T> Page<T> getObjectBySql(final String sql, final String countSql, final Class<T> objectClazz, final int current, final int size) throws Exception;
}
